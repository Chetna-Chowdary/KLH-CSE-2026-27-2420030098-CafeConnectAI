import { CartItem, KitchenStation, KitchenStationId, MenuItem, Order, QueueEstimateResult } from '../types';

export class QueueEstimationService {
  /**
   * Calculate wait time for a single menu item based on live station load and active orders ahead
   */
  public static estimateItemWait(
    item: MenuItem,
    quantity: number,
    stations: Record<KitchenStationId, KitchenStation>,
    activeOrders: Order[]
  ): QueueEstimateResult {
    const station = stations[item.stationId] || {
      id: item.stationId,
      name: 'Standard Kitchen',
      activeCapacity: 3,
      batchCapacity: 2,
      currentWorkloadPercent: 50,
      inQueueCount: 2,
      avgPreparationMinutes: 6,
      isPaused: false,
      activeWorkers: 2,
      operatingHours: '8:00 AM - 9:00 PM'
    };

    // Packaged goods picking duration vs cooked foods
    if (item.stationId === 'packaged_pickup') {
      const ordersAhead = activeOrders.filter(
        o => (o.status === 'placed' || o.status === 'accepted' || o.status === 'preparing') &&
        o.items.some(i => i.stationId === 'packaged_pickup')
      ).length;

      const pickTime = Math.max(1, Math.ceil(quantity * 0.5));
      const minMinutes = Math.max(1, pickTime + Math.floor(ordersAhead * 0.8));
      const maxMinutes = minMinutes + 2;

      return {
        minMinutes,
        maxMinutes,
        expectedReadyTime: this.formatExpectedTime(maxMinutes),
        relevantStationId: station.id,
        relevantStationName: station.name,
        ordersAhead,
        isStationOverloaded: station.currentWorkloadPercent > 85,
        isStationPaused: station.isPaused
      };
    }

    // Hot kitchen stations: calculate how many items are queued for this specific station
    let queuedItemsCount = 0;
    let relevantOrdersAhead = 0;

    activeOrders.forEach(order => {
      if (order.status === 'placed' || order.status === 'accepted' || order.status === 'preparing') {
        const stationItems = order.items.filter(i => i.stationId === item.stationId);
        if (stationItems.length > 0) {
          relevantOrdersAhead++;
          stationItems.forEach(si => {
            queuedItemsCount += si.quantity;
          });
        }
      }
    });

    // Base prep duration
    const basePrep = item.basePrepMinutes || 6;
    const activeSlots = Math.max(1, station.activeCapacity);
    const batchFactor = station.batchCapacity > 1 ? 0.75 : 1.0;

    // Time to clear existing station queue:
    // Queued items processed across available active slots
    const queueClearTime = (queuedItemsCount / activeSlots) * (basePrep * batchFactor);

    // Time for this item + its quantity
    const itemPrepTime = (quantity / activeSlots) * basePrep;

    // Delay buffer or overhead (packing, verification, handoff: 1.5 - 2 mins)
    const overhead = 2;

    let computedWait = Math.ceil(queueClearTime + itemPrepTime + overhead);

    // Apply station pause or overload penalties
    if (station.isPaused) {
      computedWait += 15;
    }

    const minMinutes = Math.max(basePrep, Math.floor(computedWait * 0.85));
    const maxMinutes = Math.max(minMinutes + 3, Math.ceil(computedWait * 1.15));

    return {
      minMinutes,
      maxMinutes,
      expectedReadyTime: this.formatExpectedTime(maxMinutes),
      relevantStationId: station.id,
      relevantStationName: station.name,
      ordersAhead: relevantOrdersAhead,
      isStationOverloaded: station.currentWorkloadPercent > 80,
      isStationPaused: station.isPaused
    };
  }

  /**
   * Calculate overall wait time for an entire cart or mixed order.
   * Runs each required station in parallel, taking the max fulfilment time!
   */
  public static estimateCartWait(
    cartItems: CartItem[],
    stations: Record<KitchenStationId, KitchenStation>,
    activeOrders: Order[]
  ): {
    minMinutes: number;
    maxMinutes: number;
    expectedReadyTime: string;
    dominantStationName: string;
    totalOrdersAhead: number;
    stationBreakdown: { stationName: string; waitRange: string; ordersAhead: number }[];
  } {
    if (cartItems.length === 0) {
      return {
        minMinutes: 0,
        maxMinutes: 0,
        expectedReadyTime: 'Immediate',
        dominantStationName: 'None',
        totalOrdersAhead: 0,
        stationBreakdown: []
      };
    }

    // Group items by station to estimate parallel kitchen station completion
    const itemsByStation = new Map<KitchenStationId, { quantity: number; sampleItem: MenuItem }>();

    cartItems.forEach(cartItem => {
      const stationId = cartItem.menuItem.stationId;
      const existing = itemsByStation.get(stationId) || { quantity: 0, sampleItem: cartItem.menuItem };
      existing.quantity += cartItem.quantity;
      itemsByStation.set(stationId, existing);
    });

    let overallMin = 0;
    let overallMax = 0;
    let dominantStationName = '';
    let maxStationWait = 0;
    let maxOrdersAhead = 0;
    const stationBreakdown: { stationName: string; waitRange: string; ordersAhead: number }[] = [];

    itemsByStation.forEach((data, stationId) => {
      const estimate = this.estimateItemWait(data.sampleItem, data.quantity, stations, activeOrders);
      
      stationBreakdown.push({
        stationName: estimate.relevantStationName,
        waitRange: `${estimate.minMinutes} - ${estimate.maxMinutes} mins`,
        ordersAhead: estimate.ordersAhead
      });

      if (estimate.maxMinutes > maxStationWait) {
        maxStationWait = estimate.maxMinutes;
        dominantStationName = estimate.relevantStationName;
      }
      overallMin = Math.max(overallMin, estimate.minMinutes);
      overallMax = Math.max(overallMax, estimate.maxMinutes);
      maxOrdersAhead = Math.max(maxOrdersAhead, estimate.ordersAhead);
    });

    return {
      minMinutes: overallMin,
      maxMinutes: overallMax,
      expectedReadyTime: this.formatExpectedTime(overallMax),
      dominantStationName,
      totalOrdersAhead: maxOrdersAhead,
      stationBreakdown
    };
  }

  public static formatExpectedTime(minutesFromNow: number): string {
    const d = new Date(Date.now() + minutesFromNow * 60000);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour should be 12
    return `${hours}:${minutes} ${ampm}`;
  }
}
