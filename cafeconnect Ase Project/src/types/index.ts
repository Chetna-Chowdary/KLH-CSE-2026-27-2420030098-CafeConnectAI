export type Role = 'student' | 'kitchen' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  email?: string;
  rollNumber?: string;
}

export type CategoryId = 
  | 'south_indian'
  | 'meals_fastfood'
  | 'burgers_sandwiches'
  | 'hot_snacks'
  | 'packaged_snacks'
  | 'hot_beverages'
  | 'cold_drinks'
  | 'desserts_bakery'
  | 'combos';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  description: string;
  imageUrl: string;
  itemCount: number;
}

export type KitchenStationId = 
  | 'dosa_breakfast'
  | 'hot_meals'
  | 'snacks_frying'
  | 'beverages'
  | 'packaged_pickup';

export interface KitchenStation {
  id: KitchenStationId;
  name: string;
  activeCapacity: number; // simultaneous slots
  batchCapacity: number;
  currentWorkloadPercent: number;
  inQueueCount: number;
  avgPreparationMinutes: number;
  isPaused: boolean;
  activeWorkers: number;
  operatingHours: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  subCategory?: string; // e.g. Dosa, Idli, Vada, Uttapam
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  basePrepMinutes: number;
  stationId: KitchenStationId;
  dietaryTags: ('veg' | 'non-veg' | 'vegan' | 'gluten-free')[];
  isBestseller?: boolean;
  isChefsSpecial?: boolean;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  availableAddOns?: AddOn[];
  customizationOptions?: {
    chutneys?: string[];
    spiceLevels?: string[];
  };
  inventoryItemId?: string; // for packaged goods or recipe linking
  isActive: boolean;
}

export interface SelectedCustomization {
  chutney?: string;
  spiceLevel?: string;
  selectedAddOns: AddOn[];
  selectedVariant?: ProductVariant;
  notes?: string;
}

export interface CartItem {
  id: string; // unique cart entry ID
  menuItem: MenuItem;
  quantity: number;
  customization?: SelectedCustomization;
  itemTotalPrice: number;
  estimatedWaitMinutes: {
    min: number;
    max: number;
  };
  ordersAhead: number;
}

export type OrderStatus = 
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customization?: SelectedCustomization;
  subtotal: number;
  stationId: KitchenStationId;
  prepStatus: 'pending' | 'preparing' | 'ready';
}

export interface OrderStatusHistoryEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string; // e.g. CC2547
  pickupNumber: string; // e.g. P-47
  customerName?: string;
  rollNumber?: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  paymentMethod: 'pay_at_counter' | 'upi';
  isPaid: boolean;
  estimatedReadyMinutes: {
    min: number;
    max: number;
  };
  estimatedReadyTime: string; // e.g. "10:48 AM"
  actualReadyTime?: string;
  stationWorkloads: Record<KitchenStationId, number>;
  statusHistory: OrderStatusHistoryEntry[];
  specialInstructions?: string;
  isDelayed?: boolean;
  delayReason?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'raw_material' | 'packaged_product' | 'dairy' | 'beverage';
  unit: 'kg' | 'liters' | 'pieces' | 'packets';
  currentStock: number;
  reorderPoint: number;
  safetyStock: number;
  avgDailyUsage: number;
  supplierLeadDays: number;
  suggestedReorderQuantity: number;
  lastRestockedDate: string;
  costPerUnit: number;
  sku?: string;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  inventoryItemName: string;
  type: 'order_deduction' | 'restock' | 'manual_adjustment' | 'spoilage';
  quantityDelta: number;
  balanceAfter: number;
  reason: string;
  timestamp: string;
  userOrOrderId: string;
}

export interface OperationalAlert {
  id: string;
  type: 'low_stock' | 'critical_stock' | 'station_overload' | 'long_wait' | 'delayed_order' | 'station_outage';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  targetId?: string;
  timestamp: string;
  isAcknowledged: boolean;
  suggestedAction: string;
}

export interface QueueEstimateResult {
  minMinutes: number;
  maxMinutes: number;
  expectedReadyTime: string;
  relevantStationId: KitchenStationId;
  relevantStationName: string;
  ordersAhead: number;
  isStationOverloaded: boolean;
  isStationPaused: boolean;
}
