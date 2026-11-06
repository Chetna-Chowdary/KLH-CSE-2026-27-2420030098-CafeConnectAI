import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Category,
  CartItem, 
  InventoryItem, 
  KitchenStation, 
  KitchenStationId, 
  MenuItem, 
  OperationalAlert, 
  Order, 
  OrderStatus, 
  Role, 
  SelectedCustomization, 
  StockMovement, 
  User 
} from '../types';
import { 
  INITIAL_ALERTS, 
  INITIAL_INVENTORY, 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_STATIONS 
} from '../services/mockData';
import { QueueEstimationService } from '../services/queueEstimationService';
import {
  fetchMenuItems,
  fetchCategories,
  fetchKitchenStations,
  fetchOrders,
  createOrder,
  createMenuItem
  
} from '../services/menuApi';
interface CafeContextType {
  categories: Category[];


  // Auth & Roles
  currentUser: User;
  setCurrentUser: (user: User) => void;
  loginAs: (role: Role, name?: string, roll?: string) => void;
  logout: () => void;

  // Menu
  menuItems: MenuItem[];
  updateMenuItem: (item: MenuItem) => void;
  toggleItemAvailability: (itemId: string) => void;
  addMenuItem: (item: MenuItem) => void;

  // Kitchen Stations
  stations: Record<KitchenStationId, KitchenStation>;
  updateStation: (stationId: KitchenStationId, updates: Partial<KitchenStation>) => void;
  toggleStationPause: (stationId: KitchenStationId) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, customization?: SelectedCustomization) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  cartWaitEstimate: {
    minMinutes: number;
    maxMinutes: number;
    expectedReadyTime: string;
    dominantStationName: string;
    totalOrdersAhead: number;
    stationBreakdown: { stationName: string; waitRange: string; ordersAhead: number }[];
  };

  // Orders
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
placeOrder: (
  customerName?: string,
  rollNumber?: string,
  paymentMethod?: 'pay_at_counter' | 'upi',
  notes?: string
) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => boolean;
  cancelOrder: (orderId: string, reason?: string) => boolean;
  flagOrderDelay: (orderId: string, reason: string) => void;

  // Inventory & Stock
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  restockItem: (itemId: string, quantityToAdd: number, reason?: string) => void;
  adjustStock: (itemId: string, newQuantity: number, reason: string) => void;

  // Alerts
  alerts: OperationalAlert[];
  unreadAlertsCount: number;
  acknowledgeAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;

  // Simulated Time & Search / Helpers
  currentSimulatedTime: string;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MENU: 'cafe_connect_menu_v1',
  STATIONS: 'cafe_connect_stations_v1',
  ORDERS: 'cafe_connect_orders_v1',
  ACTIVE_ORDER_ID: 'cafe_connect_active_order_id_v1',
  INVENTORY: 'cafe_connect_inventory_v1',
  MOVEMENTS: 'cafe_connect_movements_v1',
  ALERTS: 'cafe_connect_alerts_v1',
  USER: 'cafe_connect_user_v1',
  CART: 'cafe_connect_cart_v1'
};

export const CafeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user / Guest default
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return { id: 'usr_guest', name: 'Student Guest', role: 'student' };
  });

  // Menu items
// Menu items
const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
useEffect(() => {
  fetchMenuItems()
    .then((data) => {
      setMenuItems(data);
    })
    .catch((error) => {
      console.error('Failed to load menu items:', error);
    });
}, []);
const [categories, setCategories] = useState<Category[]>([]);
useEffect(() => {
  fetchCategories()
    .then((data) => {
     setCategories(
  data.map((category: Category) => ({
    ...category,
    itemCount: menuItems.filter(
      (item) => (item as any).categoryId === category.id
    ).length,
  }))
);
    })
    .catch((error) => {
      console.error('Failed to load categories:', error);
    });
}, [menuItems]);
  // Kitchen Stations
 const [stations, setStations] = useState<Record<KitchenStationId, KitchenStation>>(
  {} as Record<KitchenStationId, KitchenStation>
);
useEffect(() => {
  fetchKitchenStations()
    .then((data) => {
      const stationMap = Object.fromEntries(
        data.map((station) => [station.id, station])
      ) as Record<KitchenStationId, KitchenStation>;

      setStations(stationMap);
    })
    .catch((error) => {
      console.error('Failed to load kitchen stations:', error);
    });
}, []);

  // Orders
 const [orders, setOrders] = useState<Order[]>([]);
 useEffect(() => {
  fetchOrders()
    .then((data) => {
      setOrders(data);
    })
    .catch((error) => {
      console.error('Failed to load orders:', error);
    });
}, []);

  // Active tracked order
  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_ORDER_ID);
    return saved || 'CC2547';
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default initial cart matching reference Screen 5:
    // Masala Dosa x1 (₹60), Filter Coffee x1 (₹30), Veg Sandwich x1 (₹50) = ₹140
    const masalaDosa = INITIAL_MENU_ITEMS.find(i => i.id === 'item_masala_dosa')!;
    const filterCoffee = INITIAL_MENU_ITEMS.find(i => i.id === 'item_filter_coffee')!;
    const vegSandwich = INITIAL_MENU_ITEMS.find(i => i.id === 'item_veg_sandwich')!;

    return [
      {
        id: 'cart_init_1',
        menuItem: masalaDosa,
        quantity: 1,
        itemTotalPrice: 60,
        estimatedWaitMinutes: { min: 8, max: 12 },
        ordersAhead: 3
      },
      {
        id: 'cart_init_2',
        menuItem: filterCoffee,
        quantity: 1,
        itemTotalPrice: 30,
        estimatedWaitMinutes: { min: 3, max: 5 },
        ordersAhead: 1
      },
      {
        id: 'cart_init_3',
        menuItem: vegSandwich,
        quantity: 1,
        itemTotalPrice: 50,
        estimatedWaitMinutes: { min: 5, max: 8 },
        ordersAhead: 2
      }
    ];
  });

  // Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_INVENTORY;
  });

  // Stock movements
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: 'mov_01',
        inventoryItemId: 'inv_fresh_milk',
        inventoryItemName: 'Full Cream Cow Milk',
        type: 'restock',
        quantityDelta: 20,
        balanceAfter: 32,
        reason: 'Daily Morning Dairy Delivery (PO #9042)',
        timestamp: '07:30 AM, Today',
        userOrOrderId: 'Vendor: Nandini Dairy'
      },
      {
        id: 'mov_02',
        inventoryItemId: 'inv_dosa_batter',
        inventoryItemName: 'Fermented Dosa Batter',
        type: 'order_deduction',
        quantityDelta: -2.5,
        balanceAfter: 18.5,
        reason: 'Consumed by Breakfast Batches #CC2540 - #CC2546',
        timestamp: '09:15 AM, Today',
        userOrOrderId: 'Batch Prep'
      }
    ];
  });

  // Alerts
  const [alerts, setAlerts] = useState<OperationalAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALERTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ALERTS;
  });

  // Persist whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  


  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ORDER_ID, activeOrderId);
    }
  }, [activeOrderId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(stockMovements));
  }, [stockMovements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
  }, [alerts]);

  // Auth helper
  const loginAs = (role: Role, name?: string, roll?: string) => {
    let finalUser: User;
    if (role === 'admin') {
      finalUser = {
        id: 'usr_admin',
        name: name || 'Cafeteria Manager',
        role: 'admin',
        email: 'admin@cafeconnect.edu'
      };
    } else if (role === 'kitchen') {
      finalUser = {
        id: 'usr_kitchen',
        name: name || 'Chef Ramesh Kumar',
        role: 'kitchen',
        email: 'kitchen@cafeconnect.edu'
      };
    } else {
      finalUser = {
        id: 'usr_student',
        name: name || 'Chaitanya',
        role: 'student',
        rollNumber: roll || 'CS23B104'
      };
    }
    setCurrentUser(finalUser);
  };

  const logout = () => {
    setCurrentUser({ id: 'usr_guest', name: 'Student Guest', role: 'student' });
  };

  // Menu operations
  const updateMenuItem = (updatedItem: MenuItem) => {
    setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, isAvailable: !item.isAvailable };
      }
      return item;
    }));
  };

 const addMenuItem = async (item: MenuItem) => {
  try {
    const savedItem = await createMenuItem(item);
    setMenuItems(prev => [savedItem, ...prev]);
  } catch (error) {
    console.error('Error saving menu item:', error);
    alert('Failed to save menu item. Please try again.');
  }
};

  // Station operations
  const updateStation = (stationId: KitchenStationId, updates: Partial<KitchenStation>) => {
    setStations(prev => ({
      ...prev,
      [stationId]: { ...prev[stationId], ...updates }
    }));
  };

  const toggleStationPause = (stationId: KitchenStationId) => {
    setStations(prev => {
      const station = prev[stationId];
      const newPaused = !station.isPaused;
      
      // If paused, trigger alert
      if (newPaused) {
        setAlerts(al => [
          {
            id: `alt_station_${Date.now()}`,
            type: 'station_outage',
            severity: 'critical',
            title: `${station.name} Temporarily Paused`,
            message: `${station.name} has been paused by staff for maintenance or stock clearing. Wait times increased.`,
            targetId: stationId,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isAcknowledged: false,
            suggestedAction: 'Resume station operations as soon as maintenance completes.'
          },
          ...al
        ]);
      }

      return {
        ...prev,
        [stationId]: {
          ...station,
          isPaused: newPaused
        }
      };
    });
  };

  // Cart operations
  const addToCart = (item: MenuItem, quantity: number = 1, customization?: SelectedCustomization) => {
    setCart(prev => {
      // Calculate unit price with add-ons & variant
      let unitPrice = item.price;
      if (customization?.selectedVariant) {
        unitPrice += customization.selectedVariant.priceDelta;
      }
      if (customization?.selectedAddOns) {
        customization.selectedAddOns.forEach(a => {
          unitPrice += a.price;
        });
      }

      // Check if same item & customization exists
      const existingIndex = prev.findIndex(ci => 
        ci.menuItem.id === item.id && 
        JSON.stringify(ci.customization || {}) === JSON.stringify(customization || {})
      );

      // Estimate wait
      const waitEst = QueueEstimationService.estimateItemWait(item, quantity, stations, orders);

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotalPrice: newQty * unitPrice,
          estimatedWaitMinutes: { min: waitEst.minMinutes, max: waitEst.maxMinutes },
          ordersAhead: waitEst.ordersAhead
        };
        return updated;
      } else {
        const newCartItem: CartItem = {
          id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          menuItem: item,
          quantity,
          customization,
          itemTotalPrice: quantity * unitPrice,
          estimatedWaitMinutes: { min: waitEst.minMinutes, max: waitEst.maxMinutes },
          ordersAhead: waitEst.ordersAhead
        };
        return [...prev, newCartItem];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(ci => {
      if (ci.id === cartItemId) {
        const unitPrice = ci.itemTotalPrice / ci.quantity;
        const waitEst = QueueEstimationService.estimateItemWait(ci.menuItem, newQuantity, stations, orders);
        return {
          ...ci,
          quantity: newQuantity,
          itemTotalPrice: newQuantity * unitPrice,
          estimatedWaitMinutes: { min: waitEst.minMinutes, max: waitEst.maxMinutes },
          ordersAhead: waitEst.ordersAhead
        };
      }
      return ci;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.itemTotalPrice, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartWaitEstimate = useMemo(() => {
    return QueueEstimationService.estimateCartWait(cart, stations, orders);
  }, [cart, stations, orders]);

  // Order placement & lifecycle
  const placeOrder = async (
    customerName?: string, 
    rollNumber?: string, 
    paymentMethod: 'pay_at_counter' | 'upi' = 'pay_at_counter',
    notes?: string
 ): Promise<Order> => {
    const orderNum = 2547 + orders.length;
    const orderId = `CC${orderNum}`;
    const pickupNumber = `P-${orderNum % 100}`;
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const overallWait = QueueEstimationService.estimateCartWait(cart, stations, orders);

    const orderItems = cart.map((ci, index) => ({
      id: `oi_${Date.now()}_${index}`,
      menuItemId: ci.menuItem.id,
      name: ci.menuItem.name,
      price: ci.itemTotalPrice / ci.quantity,
      quantity: ci.quantity,
      customization: ci.customization,
      subtotal: ci.itemTotalPrice,
      stationId: ci.menuItem.stationId,
      prepStatus: 'pending' as const
    }));

    const newOrder: Order = {
      id: orderId,
      pickupNumber,
      customerName: customerName || currentUser.name || 'Guest Student',
      rollNumber: rollNumber || currentUser.rollNumber || 'CS23B104',
      createdAt: nowStr,
      updatedAt: nowStr,
      status: 'placed',
      items: orderItems,
      subtotal: cartTotal,
      tax: 0,
      totalAmount: cartTotal,
      paymentMethod,
      isPaid: paymentMethod === 'upi',
      estimatedReadyMinutes: { min: overallWait.minMinutes, max: overallWait.maxMinutes },
      estimatedReadyTime: overallWait.expectedReadyTime,
      stationWorkloads: {
        dosa_breakfast: stations.dosa_breakfast.currentWorkloadPercent,
        beverages: stations.beverages.currentWorkloadPercent,
        snacks_frying: stations.snacks_frying.currentWorkloadPercent,
        hot_meals: stations.hot_meals.currentWorkloadPercent,
        packaged_pickup: stations.packaged_pickup.currentWorkloadPercent
      },
      statusHistory: [
        { status: 'placed', timestamp: nowStr, note: 'Order placed via Web App' }
      ],
      specialInstructions: notes
    };
await createOrder({
  id: newOrder.id,
  pickupNumber: newOrder.pickupNumber,
  customerName: newOrder.customerName,
  rollNumber: newOrder.rollNumber,
  subtotal: newOrder.subtotal,
  tax: newOrder.tax,
  totalAmount: newOrder.totalAmount,
  paymentMethod: newOrder.paymentMethod,
  estimatedWaitMin: newOrder.estimatedReadyMinutes.min,
  estimatedWaitMax: newOrder.estimatedReadyMinutes.max,
  estimatedReadyTime: newOrder.estimatedReadyTime,
  specialInstructions: newOrder.specialInstructions,
  items: newOrder.items.map(item => ({
    menuItemId: item.menuItemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    subtotal: item.subtotal,
    stationId: item.stationId
  }))
});
    // Update stations queue count
    setStations(prev => {
      const updated = { ...prev };
      cart.forEach(ci => {
        const s = updated[ci.menuItem.stationId];
        if (s) {
          s.inQueueCount += 1;
          s.currentWorkloadPercent = Math.min(100, s.currentWorkloadPercent + 5);
        }
      });
      return updated;
    });

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    clearCart();

    return newOrder;
  };

  // Update order status (with automatic inventory deduction and station update on complete!)
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string): boolean => {
    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return false;

    // Validate valid transitions:
    // placed -> accepted -> preparing -> ready -> completed
    const validMap: Record<OrderStatus, OrderStatus[]> = {
      placed: ['accepted', 'preparing', 'cancelled'],
      accepted: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['completed'],
      completed: [],
      cancelled: []
    };

    if (!validMap[targetOrder.status]?.includes(newStatus)) {
      console.warn(`Invalid order status transition from ${targetOrder.status} to ${newStatus}`);
      return false;
    }

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedItems = o.items.map(item => ({
          ...item,
          prepStatus: (newStatus === 'ready' || newStatus === 'completed') 
            ? ('ready' as const) 
            : (newStatus === 'preparing' ? 'preparing' as const : item.prepStatus)
        }));

        return {
          ...o,
          status: newStatus,
          updatedAt: nowStr,
          actualReadyTime: newStatus === 'ready' ? nowStr : o.actualReadyTime,
          items: updatedItems,
          statusHistory: [
            ...o.statusHistory,
            { status: newStatus, timestamp: nowStr, note: note || `Order transitioned to ${newStatus}` }
          ]
        };
      }
      return o;
    }));

    // If order is completed or ready, deduct inventory consistently!
    if (newStatus === 'completed' || newStatus === 'ready') {
      deductStockForOrder(targetOrder);
    }

    // If completed or cancelled, decrement station queue
    if (newStatus === 'completed' || newStatus === 'cancelled') {
      setStations(prev => {
        const updated = { ...prev };
        targetOrder.items.forEach(item => {
          const s = updated[item.stationId];
          if (s && s.inQueueCount > 0) {
            s.inQueueCount -= 1;
            s.currentWorkloadPercent = Math.max(10, s.currentWorkloadPercent - 4);
          }
        });
        return updated;
      });
    }

    return true;
  };

  const cancelOrder = (orderId: string, reason?: string): boolean => {
    return updateOrderStatus(orderId, 'cancelled', reason || 'Order cancelled');
  };

  const flagOrderDelay = (orderId: string, reason: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          isDelayed: true,
          delayReason: reason,
          estimatedReadyMinutes: {
            min: o.estimatedReadyMinutes.min + 8,
            max: o.estimatedReadyMinutes.max + 10
          },
          statusHistory: [
            ...o.statusHistory,
            { status: o.status, timestamp: nowStr, note: `Delay reported: ${reason}` }
          ]
        };
      }
      return o;
    }));

    // Trigger alert
    setAlerts(prev => [
      {
        id: `alt_delay_${Date.now()}`,
        type: 'delayed_order',
        severity: 'warning',
        title: `Preparation Delay on Order #${orderId}`,
        message: `Reason: ${reason}. Waiting customer notified.`,
        targetId: orderId,
        timestamp: nowStr,
        isAcknowledged: false,
        suggestedAction: 'Prioritize order tasks or expedite station queue.'
      },
      ...prev
    ]);
  };

  // Inventory logic
  const deductStockForOrder = (order: Order) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Deduct packaged items or basic ingredients
    order.items.forEach(orderItem => {
      // 1. Check if packaged item with direct SKU
      const menuItem = menuItems.find(m => m.id === orderItem.menuItemId);
      if (menuItem?.inventoryItemId) {
        adjustStock(
          menuItem.inventoryItemId,
          -orderItem.quantity,
          `Sold in order #${order.id}`
        );
      } else if (orderItem.name.includes('Dosa')) {
        // Recipe deduction simulation: 0.15kg batter + 0.1kg potato per dosa
        adjustStock('inv_dosa_batter', -(0.15 * orderItem.quantity), `Batter used in order #${order.id}`);
        adjustStock('inv_potatoes', -(0.1 * orderItem.quantity), `Potatoes used in order #${order.id}`);
      } else if (orderItem.name.includes('Coffee') || orderItem.name.includes('Tea')) {
        adjustStock('inv_fresh_milk', -(0.15 * orderItem.quantity), `Milk used in order #${order.id}`);
      } else if (orderItem.name.includes('Sandwich')) {
        adjustStock('inv_bread_loaves', -1, `Bread used in order #${order.id}`);
        if (orderItem.name.includes('Cheese')) {
          adjustStock('inv_cheese_slices', -1, `Cheese used in order #${order.id}`);
        }
      }
    });
  };

  const adjustStock = (itemId: string, quantityDelta: number, reason: string) => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = Math.max(0, Number((item.currentStock + quantityDelta).toFixed(2)));
        
        // Log movement
        setStockMovements(mv => [
          {
            id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            inventoryItemId: item.id,
            inventoryItemName: item.name,
            type: quantityDelta < 0 ? 'order_deduction' : 'manual_adjustment',
            quantityDelta,
            balanceAfter: newStock,
            reason,
            timestamp: nowStr,
            userOrOrderId: currentUser.name
          },
          ...mv
        ]);

        // Trigger alert if stock is now below reorder point
        if (newStock <= item.reorderPoint) {
          const isCritical = newStock <= item.safetyStock;
          setAlerts(al => {
            const existingAlert = al.find(a => a.targetId === item.id && !a.isAcknowledged);
            if (!existingAlert) {
              return [
                {
                  id: `alt_stock_${Date.now()}`,
                  type: isCritical ? 'critical_stock' : 'low_stock',
                  severity: isCritical ? 'critical' : 'warning',
                  title: `${isCritical ? 'Critical Stock' : 'Low Stock'}: ${item.name}`,
                  message: `Current stock: ${newStock} ${item.unit}. Below ${isCritical ? 'safety stock' : 'reorder point'} of ${item.reorderPoint} ${item.unit}.`,
                  targetId: item.id,
                  timestamp: nowStr,
                  isAcknowledged: false,
                  suggestedAction: `Reorder suggested quantity of ${item.suggestedReorderQuantity} ${item.unit} immediately.`
                },
                ...al
              ];
            }
            return al;
          });
        }

        return { ...item, currentStock: newStock };
      }
      return item;
    }));
  };

  const restockItem = (itemId: string, quantityToAdd: number, reason: string = 'Stock Replenishment') => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = Number((item.currentStock + quantityToAdd).toFixed(2));
        setStockMovements(mv => [
          {
            id: `mov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            inventoryItemId: item.id,
            inventoryItemName: item.name,
            type: 'restock',
            quantityDelta: quantityToAdd,
            balanceAfter: newStock,
            reason,
            timestamp: nowStr,
            userOrOrderId: `PO-${Math.floor(1000 + Math.random() * 9000)}`
          },
          ...mv
        ]);

        // Clear low stock alert if restocked above reorder point
        if (newStock > item.reorderPoint) {
          setAlerts(al => al.filter(a => a.targetId !== item.id));
        }

        return {
          ...item,
          currentStock: newStock,
          lastRestockedDate: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  // Alerts
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, isAcknowledged: true } : a));
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const unreadAlertsCount = useMemo(() => {
    return alerts.filter(a => !a.isAcknowledged).length;
  }, [alerts]);

  const activeOrder = useMemo(() => {
    if (!activeOrderId) return orders[0] || null;
    return orders.find(o => o.id === activeOrderId) || orders[0] || null;
  }, [orders, activeOrderId]);

  return (
    <CafeContext.Provider
      value={{
        currentUser,
        categories,
        setCurrentUser,
        loginAs,
        logout,
        menuItems,
        updateMenuItem,
        toggleItemAvailability,
        addMenuItem,
        stations,
        updateStation,
        toggleStationPause,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        cartWaitEstimate,
        orders,
        activeOrder,
        setActiveOrder: (order) => setActiveOrderId(order ? order.id : null),
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        flagOrderDelay,
        inventory,
        stockMovements,
        restockItem,
        adjustStock,
        alerts,
        unreadAlertsCount,
        acknowledgeAlert,
        dismissAlert,
        currentSimulatedTime: '11:15 AM'
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
