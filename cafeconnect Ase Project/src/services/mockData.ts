import { 
  Category, 
  InventoryItem, 
  KitchenStation, 
  KitchenStationId, 
  MenuItem, 
  OperationalAlert, 
  Order 
} from '../types';

export const INITIAL_STATIONS: Record<KitchenStationId, KitchenStation> = {
  dosa_breakfast: {
    id: 'dosa_breakfast',
    name: 'Dosa Station',
    activeCapacity: 3,
    batchCapacity: 3,
    currentWorkloadPercent: 82,
    inQueueCount: 3,
    avgPreparationMinutes: 8,
    isPaused: false,
    activeWorkers: 2,
    operatingHours: '7:30 AM - 9:00 PM'
  },
  beverages: {
    id: 'beverages',
    name: 'Beverages Station',
    activeCapacity: 4,
    batchCapacity: 4,
    currentWorkloadPercent: 40,
    inQueueCount: 1,
    avgPreparationMinutes: 4,
    isPaused: false,
    activeWorkers: 2,
    operatingHours: '7:30 AM - 10:00 PM'
  },
  snacks_frying: {
    id: 'snacks_frying',
    name: 'Snacks Station',
    activeCapacity: 3,
    batchCapacity: 2,
    currentWorkloadPercent: 60,
    inQueueCount: 2,
    avgPreparationMinutes: 7,
    isPaused: false,
    activeWorkers: 1,
    operatingHours: '9:00 AM - 9:30 PM'
  },
  hot_meals: {
    id: 'hot_meals',
    name: 'Hot Meals Station',
    activeCapacity: 3,
    batchCapacity: 2,
    currentWorkloadPercent: 50,
    inQueueCount: 2,
    avgPreparationMinutes: 9,
    isPaused: false,
    activeWorkers: 2,
    operatingHours: '11:00 AM - 9:00 PM'
  },
  packaged_pickup: {
    id: 'packaged_pickup',
    name: 'Packaged Goods & Quick Pick',
    activeCapacity: 6,
    batchCapacity: 4,
    currentWorkloadPercent: 15,
    inQueueCount: 0,
    avgPreparationMinutes: 2,
    isPaused: false,
    activeWorkers: 1,
    operatingHours: '7:30 AM - 10:30 PM'
  }
};

export const CATEGORIES: Category[] = [
  {
    id: 'south_indian',
    name: 'South Indian',
    iconName: 'Soup',
    description: 'Authentic Flavours. Always a Favourite.',
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    itemCount: 7
  },
  {
    id: 'meals_fastfood',
    name: 'North Indian & Meals',
    iconName: 'Utensils',
    description: 'Hearty fried rice, noodles, rolls & wholesome curries',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    itemCount: 6
  },
  {
    id: 'burgers_sandwiches',
    name: 'Burgers & Sandwiches',
    iconName: 'Sandwich',
    description: 'Grilled sandwiches, artisan burgers & fresh rolls',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    itemCount: 6
  },
  {
    id: 'hot_snacks',
    name: 'Snacks',
    iconName: 'Flame',
    description: 'Crispy samosas, loaded fries, puffs and fritters',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    itemCount: 6
  },
  {
    id: 'packaged_snacks',
    name: 'Packaged Snacks',
    iconName: 'Package',
    description: 'Chips, chocolates, cookies & grab-and-go treats',
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
    itemCount: 8
  },
  {
    id: 'hot_beverages',
    name: 'Tea & Coffee',
    iconName: 'Coffee',
    description: 'Fresh filter coffee, masala chai, cappuccinos',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    itemCount: 5
  },
  {
    id: 'cold_drinks',
    name: 'Beverages',
    iconName: 'GlassWater',
    description: 'Cold coffees, milkshakes, juices & refreshments',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    itemCount: 7
  },
  {
    id: 'desserts_bakery',
    name: 'Desserts',
    iconName: 'Cake',
    description: 'Brownies, muffins, donuts and pastries',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    itemCount: 5
  },
  {
    id: 'combos',
    name: 'Combos & Deals',
    iconName: 'Sparkles',
    description: 'Student favorite hunger buster bundles',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    itemCount: 4
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // A. South Indian
  {
    id: 'item_plain_dosa',
    name: 'Plain Dosa',
    description: 'Golden crispy thin crepe made with fermented lentil & rice batter, served with fresh coconut chutney & piping hot sambar.',
    category: 'south_indian',
    subCategory: 'Dosa',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 6,
    stationId: 'dosa_breakfast',
    dietaryTags: ['veg', 'gluten-free'],
    rating: 4.6,
    reviewCount: 840,
    availableAddOns: [
      { id: 'addon_extra_sambar', name: 'Extra Sambar', price: 10 },
      { id: 'addon_ghee_roast', name: 'Ghee Roast Upgrade', price: 15 }
    ],
    customizationOptions: {
      chutneys: ['Coconut Chutney', 'Tomato Chutney', 'Mint Chutney'],
      spiceLevels: ['Mild', 'Medium', 'Spicy']
    },
    isActive: true
  },
  {
    id: 'item_masala_dosa',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato masala, served with freshly grated coconut chutney, tomato chutney & homestyle sambar.',
    category: 'south_indian',
    subCategory: 'Dosa',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 8,
    stationId: 'dosa_breakfast',
    dietaryTags: ['veg'],
    isBestseller: true,
    isChefsSpecial: true,
    rating: 4.7,
    reviewCount: 1240,
    availableAddOns: [
      { id: 'addon_extra_sambar', name: 'Extra Sambar', price: 10 },
      { id: 'addon_extra_aloo', name: 'Extra Potato Masala', price: 15 },
      { id: 'addon_cheese', name: 'Melted Cheese Layer', price: 20 }
    ],
    customizationOptions: {
      chutneys: ['Coconut Chutney', 'Tomato Chutney', 'Mint Chutney'],
      spiceLevels: ['Standard', 'Extra Spicy', 'Less Spicy']
    },
    isActive: true
  },
  {
    id: 'item_mysore_masala_dosa',
    name: 'Mysore Masala Dosa',
    description: 'Crisp crepe lined with signature fiery Mysore red garlic chili paste, packed with spiced potato filling & butter.',
    category: 'south_indian',
    subCategory: 'Dosa',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 9,
    stationId: 'dosa_breakfast',
    dietaryTags: ['veg'],
    rating: 4.8,
    reviewCount: 910,
    availableAddOns: [
      { id: 'addon_extra_sambar', name: 'Extra Sambar', price: 10 },
      { id: 'addon_butter', name: 'Extra Amul Butter', price: 15 }
    ],
    customizationOptions: {
      chutneys: ['Coconut Chutney', 'Tomato Chutney'],
      spiceLevels: ['Medium', 'Fiery Spicy']
    },
    isActive: true
  },
  {
    id: 'item_idli_2pcs',
    name: 'Idli (2 pcs)',
    description: 'Pillowy soft steamed rice cakes, gentle on the stomach, served with piping hot dal sambar and fresh coconut dip.',
    category: 'south_indian',
    subCategory: 'Idli',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 4,
    stationId: 'dosa_breakfast',
    dietaryTags: ['veg', 'gluten-free'],
    isBestseller: true,
    rating: 4.5,
    reviewCount: 650,
    availableAddOns: [
      { id: 'addon_extra_sambar', name: 'Extra Sambar Bowl', price: 10 },
      { id: 'addon_extra_idli', name: 'Add 1 More Idli', price: 15 }
    ],
    isActive: true
  },
  {
    id: 'item_medu_vada_2pcs',
    name: 'Medu Vada (2 pcs)',
    description: 'Golden crunchy black-gram donuts infused with crushed peppercorns, curry leaves, ginger & green chilies.',
    category: 'south_indian',
    subCategory: 'Vada',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 4,
    stationId: 'dosa_breakfast',
    dietaryTags: ['veg'],
    rating: 4.7,
    reviewCount: 780,
    availableAddOns: [
      { id: 'addon_sambar_dip', name: 'Sambar Dip Bowl', price: 10 }
    ],
    isActive: true
  },
  {
    id: 'item_podi_idli',
    name: 'Podi Idli',
    description: 'Bite-sized soft idlis tossed generously in aromatic roasted gun powder (milagai podi) and pure melted ghee.',
    category: 'south_indian',
    subCategory: 'Idli',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 5,
    stationId: 'dosa_breakfast',
    dietaryTags: ['veg'],
    rating: 4.9,
    reviewCount: 520,
    isActive: true
  },
  {
    id: 'item_uttapam',
    name: 'Uttapam',
    description: 'Thick savoury fermented pancake topped with caramelized red onions, juicy tomatoes, and fresh coriander leaves.',
    category: 'south_indian',
    subCategory: 'Uttapam',
    price: 55,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 8,
    stationId: 'dosa_breakfast',
    dietaryTags: ['veg'],
    rating: 4.4,
    reviewCount: 310,
    availableAddOns: [
      { id: 'addon_cheese', name: 'Cheese Topping', price: 20 }
    ],
    isActive: true
  },

  // B. Meals & Indian Fast Food
  {
    id: 'item_veg_fried_rice',
    name: 'Veg Fried Rice',
    description: 'Fragrant wok-tossed basmati rice with crunchy seasonal veggies, spring onion, and aromatic Asian seasonings.',
    category: 'meals_fastfood',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 9,
    stationId: 'hot_meals',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.6,
    reviewCount: 880,
    availableAddOns: [
      { id: 'addon_paneer_extra', name: 'Extra Paneer Cubes', price: 25 },
      { id: 'addon_schezwan', name: 'Schezwan Sauce Dip', price: 10 }
    ],
    isActive: true
  },
  {
    id: 'item_veg_noodles',
    name: 'Veg Hakka Noodles',
    description: 'Classic Kolkata street-style wok tossed noodles with shredded cabbage, bell peppers, carrots, and light soy glaze.',
    category: 'meals_fastfood',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 8,
    stationId: 'hot_meals',
    dietaryTags: ['veg'],
    rating: 4.5,
    reviewCount: 620,
    isActive: true
  },
  {
    id: 'item_paneer_roll',
    name: 'Paneer Kathi Roll',
    description: 'Soft flaky paratha wrapped with marinated chargrilled paneer tikka cubes, spiced pickled onions, and mint yogurt dip.',
    category: 'meals_fastfood',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 8,
    stationId: 'hot_meals',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.8,
    reviewCount: 940,
    isActive: true
  },
  {
    id: 'item_pav_bhaji',
    name: 'Butter Pav Bhaji',
    description: 'Rich spiced mashed vegetable gravy simmered in butter on a tawa, served with two hot toasted butter pavs and chopped onions.',
    category: 'meals_fastfood',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 7,
    stationId: 'hot_meals',
    dietaryTags: ['veg'],
    isChefsSpecial: true,
    rating: 4.7,
    reviewCount: 1100,
    availableAddOns: [
      { id: 'addon_extra_pav', name: 'Extra Butter Pav (Pair)', price: 20 },
      { id: 'addon_cheese', name: 'Grated Cheese', price: 20 }
    ],
    isActive: true
  },
  {
    id: 'item_chole_kulche',
    name: 'Amritsari Chole Kulche',
    description: 'Tangy Punjabi chickpeas cooked with pindi masala, served with 2 fluffy tandoor-style kulchas and spiced green chili pickle.',
    category: 'meals_fastfood',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 6,
    stationId: 'hot_meals',
    dietaryTags: ['veg'],
    rating: 4.6,
    reviewCount: 450,
    isActive: true
  },
  {
    id: 'item_veg_pulao',
    name: 'Veg Matar Pulao',
    description: 'Whole spice tempered basmati pulao loaded with green peas, carrots, beans, served with chilled boondi raita.',
    category: 'meals_fastfood',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 6,
    stationId: 'hot_meals',
    dietaryTags: ['veg', 'gluten-free'],
    rating: 4.3,
    reviewCount: 310,
    isActive: true
  },

  // C. Burgers, Sandwiches & Wraps
  {
    id: 'item_veg_sandwich',
    name: 'Veg Club Sandwich',
    description: 'Triple layer jumbo bread filled with crisp cucumber, ripe tomatoes, potato slices, spiced mint chutney, and fresh butter.',
    category: 'burgers_sandwiches',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 5,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.6,
    reviewCount: 790,
    availableAddOns: [
      { id: 'addon_cheese', name: 'Add Cheese Slice', price: 15 },
      { id: 'addon_toast', name: 'Grill & Toast', price: 10 }
    ],
    isActive: true
  },
  {
    id: 'item_grilled_cheese_sandwich',
    name: 'Grilled Cheese Sandwich',
    description: 'Golden grilled sandwich oozing with melted mozzarella & cheddar, sprinkled with oregano and chili flakes.',
    category: 'burgers_sandwiches',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 6,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    rating: 4.7,
    reviewCount: 680,
    isActive: true
  },
  {
    id: 'item_veg_burger',
    name: 'Crispy Veg Burger',
    description: 'Golden vegetable patty served in toasted sesame bun with crisp iceberg lettuce, sliced tomatoes, and creamy house mayo.',
    category: 'burgers_sandwiches',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 7,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.7,
    reviewCount: 950,
    availableAddOns: [
      { id: 'addon_cheese', name: 'Cheese Slice', price: 15 },
      { id: 'addon_peri_peri', name: 'Peri-Peri Seasoning', price: 10 }
    ],
    isActive: true
  },
  {
    id: 'item_paneer_burger',
    name: 'Spicy Paneer Tikka Burger',
    description: 'Thick marinated cottage cheese steak pan-seared to perfection, layered with tandoori mayo and crunchy greens.',
    category: 'burgers_sandwiches',
    price: 90,
    imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 8,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    isChefsSpecial: true,
    rating: 4.9,
    reviewCount: 520,
    isActive: true
  },
  {
    id: 'item_aloo_tikki_burger',
    name: 'Desi Aloo Tikki Burger',
    description: 'Homestyle spiced potato patty with sweet tamarind glaze, green chutney, onions, and crispy toasted buns.',
    category: 'burgers_sandwiches',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 6,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    rating: 4.4,
    reviewCount: 410,
    isActive: true
  },
  {
    id: 'item_paneer_wrap',
    name: 'Paneer Salsa Wrap',
    description: 'Soft tortilla stuffed with grilled paneer, crunchy bell peppers, tangy tomato salsa, and chipotle dressing.',
    category: 'burgers_sandwiches',
    price: 80,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 7,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    rating: 4.6,
    reviewCount: 380,
    isActive: true
  },

  // D. Hot Snacks
  {
    id: 'item_samosa',
    name: 'Punjabi Samosa (1 pc)',
    description: 'Flaky deep-fried triangle pastry stuffed with cumin spiced potato and green peas, served with sweet tamarind & green dip.',
    category: 'hot_snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 3,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.8,
    reviewCount: 1600,
    isActive: true
  },
  {
    id: 'item_veg_puff',
    name: 'Crispy Veg Puff',
    description: 'Multi-layered flaky bakery puff pastry with seasoned potato, peas and carrot filling. Baked fresh throughout the day.',
    category: 'hot_snacks',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 3,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    rating: 4.5,
    reviewCount: 540,
    isActive: true
  },
  {
    id: 'item_french_fries',
    name: 'Salted French Fries',
    description: 'Classic crisp golden potato batons tossed in sea salt. Served hot with tomato ketchup.',
    category: 'hot_snacks',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 6,
    stationId: 'snacks_frying',
    dietaryTags: ['veg', 'gluten-free'],
    rating: 4.5,
    reviewCount: 820,
    isActive: true
  },
  {
    id: 'item_peri_peri_fries',
    name: 'Peri-Peri Seasoned Fries',
    description: 'Crisp hot fries dusted in spicy African peri-peri chili blend, served with garlic dip.',
    category: 'hot_snacks',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 6,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.7,
    reviewCount: 1150,
    isActive: true
  },
  {
    id: 'item_veg_spring_rolls',
    name: 'Veg Spring Rolls (4 pcs)',
    description: 'Thin crispy golden rolls packed with julienned vegetables and ginger, served with sweet chili dip.',
    category: 'hot_snacks',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 6,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    rating: 4.6,
    reviewCount: 420,
    isActive: true
  },
  {
    id: 'item_bread_pakora',
    name: 'Stuffed Bread Pakora',
    description: 'Bread sandwich stuffed with seasoned potato mash, coated in spiced gram flour batter and fried until crisp.',
    category: 'hot_snacks',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 4,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    rating: 4.5,
    reviewCount: 390,
    isActive: true
  },

  // E. Packaged Snacks & Chocolates (SKU Level)
  {
    id: 'item_lays_classic',
    name: 'Lays Potato Chips',
    description: 'Crispy wafer-thin potato chips. Available in India’s Magic Masala or Classic Salted.',
    category: 'packaged_snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.8,
    reviewCount: 1400,
    variants: [
      { id: 'v_lays_magic', name: 'Magic Masala (Blue)', priceDelta: 0 },
      { id: 'v_lays_salted', name: 'Classic Salted (Yellow)', priceDelta: 0 },
      { id: 'v_lays_cream_onion', name: 'Cream & Onion (Green)', priceDelta: 0 }
    ],
    inventoryItemId: 'inv_lays_chips',
    isActive: true
  },
  {
    id: 'item_bingo',
    name: 'Bingo Mad Angles',
    description: 'Triangle shaped crunchy corn & rice chips bursting with spicy achari taste.',
    category: 'packaged_snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.5,
    reviewCount: 460,
    variants: [
      { id: 'v_bingo_achari', name: 'Achaari Masti', priceDelta: 0 },
      { id: 'v_bingo_chili', name: 'Very Peri Peri', priceDelta: 0 }
    ],
    inventoryItemId: 'inv_bingo_chips',
    isActive: true
  },
  {
    id: 'item_kurkure',
    name: 'Kurkure Masala Munch',
    description: 'Tedha par mera crunchy puffcorn sticks coated in chatpata spice seasoning.',
    category: 'packaged_snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.7,
    reviewCount: 890,
    inventoryItemId: 'inv_kurkure',
    isActive: true
  },
  {
    id: 'item_dairy_milk',
    name: 'Cadbury Dairy Milk',
    description: 'Smooth, creamy melt-in-mouth milk chocolate bar. Perfect quick study booster.',
    category: 'packaged_snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.9,
    reviewCount: 2200,
    variants: [
      { id: 'v_dm_regular', name: 'Regular Bar 24g', priceDelta: 0 },
      { id: 'v_dm_roast_almond', name: 'Fruit & Nut 40g', priceDelta: 25 }
    ],
    inventoryItemId: 'inv_dairy_milk',
    isActive: true
  },
  {
    id: 'item_kitkat',
    name: 'Nestlé KitKat (4 Finger)',
    description: 'Crisp wafer fingers enrobed in smooth milk chocolate. Have a break, have a KitKat.',
    category: 'packaged_snacks',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.8,
    reviewCount: 1100,
    inventoryItemId: 'inv_kitkat',
    isActive: true
  },
  {
    id: 'item_5star',
    name: 'Cadbury 5 Star',
    description: 'Chewy caramel and nougat covered with rich chocolate. Eat 5 Star, do nothing.',
    category: 'packaged_snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.6,
    reviewCount: 520,
    inventoryItemId: 'inv_5star',
    isActive: true
  },
  {
    id: 'item_cookies',
    name: 'Sunfeast Dark Fantasy Cookies',
    description: 'Baked chocolate cookies with a molten liquid choco-fudge core center.',
    category: 'packaged_snacks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.7,
    reviewCount: 410,
    isActive: true
  },
  {
    id: 'item_packaged_cake',
    name: 'Winkies Red Velvet Packaged Cake',
    description: 'Moist single serve sponge cake slice with creamy vanilla filling.',
    category: 'packaged_snacks',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.5,
    reviewCount: 330,
    isActive: true
  },

  // F. Tea & Hot Beverages
  {
    id: 'item_masala_chai',
    name: 'Desi Masala Chai',
    description: 'Aromatic strong Assam tea brewed with crushed cardamom, ginger, cloves, cinnamon and whole cow milk.',
    category: 'hot_beverages',
    price: 15,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 3,
    stationId: 'beverages',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.9,
    reviewCount: 2800,
    customizationOptions: {
      spiceLevels: ['Standard Sugar', 'Less Sugar', 'No Sugar']
    },
    isActive: true
  },
  {
    id: 'item_filter_coffee',
    name: 'Authentic Filter Coffee',
    description: 'South Indian brass-filtered decoction blended with frothy hot milk, served piping hot in traditional tumbler.',
    category: 'hot_beverages',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 3,
    stationId: 'beverages',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.8,
    reviewCount: 1950,
    customizationOptions: {
      spiceLevels: ['Standard Sweet', 'Strong & Less Sugar', 'Sugar-Free']
    },
    isActive: true
  },
  {
    id: 'item_cappuccino',
    name: 'Espresso Cappuccino',
    description: 'Dark roasted espresso topped with thick velvety microfoam steamed milk and a dusting of cocoa.',
    category: 'hot_beverages',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 4,
    stationId: 'beverages',
    dietaryTags: ['veg'],
    rating: 4.6,
    reviewCount: 610,
    isActive: true
  },
  {
    id: 'item_hot_chocolate',
    name: 'Rich Hot Chocolate',
    description: 'Velvety dark chocolate melted into warm creamy milk, topped with chocolate sprinkles.',
    category: 'hot_beverages',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 4,
    stationId: 'beverages',
    dietaryTags: ['veg'],
    rating: 4.7,
    reviewCount: 440,
    isActive: true
  },
  {
    id: 'item_green_tea',
    name: 'Organic Honey Green Tea',
    description: 'Delicate whole leaf green tea infused with pure natural honey and lemon zest.',
    category: 'hot_beverages',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 2,
    stationId: 'beverages',
    dietaryTags: ['veg', 'gluten-free'],
    rating: 4.3,
    reviewCount: 220,
    isActive: true
  },

  // G. Cold Drinks
  {
    id: 'item_bottled_water',
    name: 'Packaged Mineral Water (500ml)',
    description: 'Chilled sealed mineral water with balanced essential minerals.',
    category: 'cold_drinks',
    price: 20,
    imageUrl: 'https://images.unsplash.com/photo-1559839914-ba2ac626774e?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg', 'gluten-free'],
    rating: 4.9,
    reviewCount: 990,
    inventoryItemId: 'inv_water_bottle',
    isActive: true
  },
  {
    id: 'item_soft_drink',
    name: 'Chilled Soft Drink Can (300ml)',
    description: 'Refreshing carbonated drink. Choice of Coca Cola, Sprite, Thums Up or Diet Coke.',
    category: 'cold_drinks',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.6,
    reviewCount: 780,
    variants: [
      { id: 'v_thumsup', name: 'Thums Up', priceDelta: 0 },
      { id: 'v_coke', name: 'Coca Cola', priceDelta: 0 },
      { id: 'v_sprite', name: 'Sprite', priceDelta: 0 }
    ],
    isActive: true
  },
  {
    id: 'item_fresh_lime_soda',
    name: 'Fresh Lime Soda',
    description: 'Freshly squeezed lemon juice with sparkling soda water. Served sweet, salted or mixed.',
    category: 'cold_drinks',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 3,
    stationId: 'beverages',
    dietaryTags: ['veg', 'gluten-free'],
    rating: 4.7,
    reviewCount: 810,
    customizationOptions: {
      spiceLevels: ['Sweet', 'Salted', 'Sweet & Salted Mix']
    },
    isActive: true
  },
  {
    id: 'item_lemon_iced_tea',
    name: 'Lemon Iced Tea',
    description: 'Chilled brewed black tea with Meyer lemon juice and crushed mint sprigs over ice.',
    category: 'cold_drinks',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 3,
    stationId: 'beverages',
    dietaryTags: ['veg'],
    rating: 4.6,
    reviewCount: 490,
    isActive: true
  },
  {
    id: 'item_mango_juice',
    name: 'Alphonso Mango Shake',
    description: 'Thick creamy mango pulp blended with chilled milk and a scoop of vanilla ice cream.',
    category: 'cold_drinks',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 4,
    stationId: 'beverages',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.8,
    reviewCount: 920,
    isActive: true
  },
  {
    id: 'item_cold_coffee',
    name: 'Signature Cold Coffee',
    description: 'Thick, creamy blended iced coffee with espresso, milk, and chocolate syrup drizzle.',
    category: 'cold_drinks',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 4,
    stationId: 'beverages',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.8,
    reviewCount: 1350,
    availableAddOns: [
      { id: 'addon_ice_cream', name: 'Vanilla Ice Cream Scoop', price: 20 }
    ],
    isActive: true
  },
  {
    id: 'item_chocolate_milkshake',
    name: 'Chocolate Truffle Milkshake',
    description: 'Decadent chocolate shake topped with whipped cream, brownie chunks, and chocolate fudge.',
    category: 'cold_drinks',
    price: 70,
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 4,
    stationId: 'beverages',
    dietaryTags: ['veg'],
    rating: 4.7,
    reviewCount: 670,
    isActive: true
  },

  // H. Desserts & Bakery
  {
    id: 'item_brownie',
    name: 'Fudge Chocolate Brownie',
    description: 'Warm gooey Dutch cocoa walnut brownie with a shiny crinkled top. Served warm on request.',
    category: 'desserts_bakery',
    price: 50,
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 2,
    stationId: 'beverages',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.9,
    reviewCount: 880,
    availableAddOns: [
      { id: 'addon_vanilla_scoop', name: 'Vanilla Ice Cream Scoop', price: 20 }
    ],
    isActive: true
  },
  {
    id: 'item_chocolate_muffin',
    name: 'Double Chocolate Muffin',
    description: 'Soft bakery style muffin studded with Belgian chocolate chips and cocoa center.',
    category: 'desserts_bakery',
    price: 40,
    imageUrl: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 2,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.6,
    reviewCount: 420,
    isActive: true
  },
  {
    id: 'item_donut',
    name: 'Glazed Choco Donut',
    description: 'Soft fluffy ring donut coated in rich chocolate ganache and colorful sprinkles.',
    category: 'desserts_bakery',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 1,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.5,
    reviewCount: 390,
    isActive: true
  },
  {
    id: 'item_croissant',
    name: 'Butter Croissant',
    description: 'Golden flaky French pastry with 24 butter layers, toasted gently for a crispy bite.',
    category: 'desserts_bakery',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 2,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.7,
    reviewCount: 310,
    isActive: true
  },
  {
    id: 'item_pastry',
    name: 'Black Forest Pastry',
    description: 'Layers of moist chocolate sponge, whipped vanilla cream, sour cherries and dark chocolate shavings.',
    category: 'desserts_bakery',
    price: 60,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 2,
    stationId: 'packaged_pickup',
    dietaryTags: ['veg'],
    rating: 4.8,
    reviewCount: 520,
    isActive: true
  },

  // I. Combos
  {
    id: 'item_combo_south_indian',
    name: 'South Indian Super Combo',
    description: '1 Masala Dosa + 1 Medu Vada + 1 Hot Filter Coffee. The ultimate morning fuel.',
    category: 'combos',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 8,
    stationId: 'dosa_breakfast',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.9,
    reviewCount: 1450,
    isActive: true
  },
  {
    id: 'item_combo_burger_fries',
    name: 'Burger & Fries Crunch Deal',
    description: 'Crispy Veg Burger + Salted French Fries + Soft Drink Can. Save ₹20.',
    category: 'combos',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 7,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.8,
    reviewCount: 960,
    isActive: true
  },
  {
    id: 'item_combo_chai_samosa',
    name: 'Campus Chai & Samosa Duo',
    description: '2 Crispy Punjabi Samosas + 1 Steaming Masala Chai. Classic 4 PM break.',
    category: 'combos',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 3,
    stationId: 'snacks_frying',
    dietaryTags: ['veg'],
    isBestseller: true,
    rating: 4.9,
    reviewCount: 2100,
    isActive: true
  },
  {
    id: 'item_combo_chinese_bowl',
    name: 'Fried Rice & Kathi Roll Bowl',
    description: 'Half Veg Fried Rice + 1 Paneer Kathi Roll + Sweet Lime Soda.',
    category: 'combos',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    isAvailable: true,
    basePrepMinutes: 9,
    stationId: 'hot_meals',
    dietaryTags: ['veg'],
    rating: 4.7,
    reviewCount: 420,
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CC2547',
    pickupNumber: 'P-47',
    customerName: 'Chaitanya',
    rollNumber: 'CS23B104',
    createdAt: '10:32 AM',
    updatedAt: '10:33 AM',
    status: 'preparing',
    items: [
      {
        id: 'ord_item_1',
        menuItemId: 'item_masala_dosa',
        name: 'Masala Dosa',
        price: 60,
        quantity: 1,
        subtotal: 60,
        stationId: 'dosa_breakfast',
        prepStatus: 'preparing'
      },
      {
        id: 'ord_item_2',
        menuItemId: 'item_filter_coffee',
        name: 'Filter Coffee',
        price: 30,
        quantity: 1,
        subtotal: 30,
        stationId: 'beverages',
        prepStatus: 'ready'
      },
      {
        id: 'ord_item_3',
        menuItemId: 'item_veg_sandwich',
        name: 'Veg Sandwich',
        price: 50,
        quantity: 1,
        subtotal: 50,
        stationId: 'snacks_frying',
        prepStatus: 'preparing'
      }
    ],
    subtotal: 140,
    tax: 0,
    totalAmount: 140,
    paymentMethod: 'pay_at_counter',
    isPaid: false,
    estimatedReadyMinutes: { min: 12, max: 18 },
    estimatedReadyTime: '10:48 AM',
    stationWorkloads: {
      dosa_breakfast: 82,
      beverages: 40,
      snacks_frying: 60,
      hot_meals: 0,
      packaged_pickup: 0
    },
    statusHistory: [
      { status: 'placed', timestamp: '10:32 AM', note: 'Order placed via Web App' },
      { status: 'accepted', timestamp: '10:33 AM', note: 'Accepted by Dosa Station' },
      { status: 'preparing', timestamp: '10:35 AM', note: 'Masala Dosa on griddle' }
    ]
  },
  {
    id: 'CC2548',
    pickupNumber: 'P-48',
    customerName: 'Aarav Patel',
    rollNumber: 'EC22B019',
    createdAt: '10:34 AM',
    updatedAt: '10:34 AM',
    status: 'placed',
    items: [
      {
        id: 'ord_item_4',
        menuItemId: 'item_filter_coffee',
        name: 'Filter Coffee',
        price: 25,
        quantity: 2,
        subtotal: 50,
        stationId: 'beverages',
        prepStatus: 'pending'
      }
    ],
    subtotal: 50,
    tax: 0,
    totalAmount: 50,
    paymentMethod: 'upi',
    isPaid: true,
    estimatedReadyMinutes: { min: 8, max: 12 },
    estimatedReadyTime: '10:44 AM',
    stationWorkloads: {
      dosa_breakfast: 0,
      beverages: 40,
      snacks_frying: 0,
      hot_meals: 0,
      packaged_pickup: 0
    },
    statusHistory: [
      { status: 'placed', timestamp: '10:34 AM', note: 'Order received' }
    ]
  },
  {
    id: 'CC2549',
    pickupNumber: 'P-49',
    customerName: 'Sneha Rao',
    rollNumber: 'ME21B088',
    createdAt: '10:36 AM',
    updatedAt: '10:38 AM',
    status: 'preparing',
    items: [
      {
        id: 'ord_item_5',
        menuItemId: 'item_veg_sandwich',
        name: 'Veg Sandwich',
        price: 50,
        quantity: 1,
        subtotal: 50,
        stationId: 'snacks_frying',
        prepStatus: 'preparing'
      }
    ],
    subtotal: 50,
    tax: 0,
    totalAmount: 50,
    paymentMethod: 'pay_at_counter',
    isPaid: false,
    estimatedReadyMinutes: { min: 10, max: 15 },
    estimatedReadyTime: '10:49 AM',
    stationWorkloads: {
      dosa_breakfast: 0,
      beverages: 0,
      snacks_frying: 60,
      hot_meals: 0,
      packaged_pickup: 0
    },
    statusHistory: [
      { status: 'placed', timestamp: '10:36 AM' },
      { status: 'accepted', timestamp: '10:37 AM' },
      { status: 'preparing', timestamp: '10:38 AM' }
    ]
  },
  {
    id: 'CC2550',
    pickupNumber: 'P-50',
    customerName: 'Vikram Singh',
    rollNumber: 'EE24B012',
    createdAt: '10:38 AM',
    updatedAt: '10:40 AM',
    status: 'preparing',
    items: [
      {
        id: 'ord_item_6',
        menuItemId: 'item_plain_dosa',
        name: 'Plain Dosa',
        price: 40,
        quantity: 2,
        subtotal: 80,
        stationId: 'dosa_breakfast',
        prepStatus: 'preparing'
      }
    ],
    subtotal: 80,
    tax: 0,
    totalAmount: 80,
    paymentMethod: 'pay_at_counter',
    isPaid: false,
    estimatedReadyMinutes: { min: 15, max: 20 },
    estimatedReadyTime: '10:55 AM',
    stationWorkloads: {
      dosa_breakfast: 82,
      beverages: 0,
      snacks_frying: 0,
      hot_meals: 0,
      packaged_pickup: 0
    },
    statusHistory: [
      { status: 'placed', timestamp: '10:38 AM' },
      { status: 'accepted', timestamp: '10:39 AM' },
      { status: 'preparing', timestamp: '10:40 AM' }
    ]
  },
  {
    id: 'CC2551',
    pickupNumber: 'P-51',
    customerName: 'Ananya Sharma',
    rollNumber: 'BT23B045',
    createdAt: '10:40 AM',
    updatedAt: '10:40 AM',
    status: 'placed',
    items: [
      {
        id: 'ord_item_7',
        menuItemId: 'item_idli_2pcs',
        name: 'Idli (2 pcs)',
        price: 30,
        quantity: 1,
        subtotal: 30,
        stationId: 'dosa_breakfast',
        prepStatus: 'pending'
      },
      {
        id: 'ord_item_8',
        menuItemId: 'item_medu_vada_2pcs',
        name: 'Medu Vada (2 pcs)',
        price: 35,
        quantity: 1,
        subtotal: 35,
        stationId: 'dosa_breakfast',
        prepStatus: 'pending'
      }
    ],
    subtotal: 65,
    tax: 0,
    totalAmount: 65,
    paymentMethod: 'upi',
    isPaid: true,
    estimatedReadyMinutes: { min: 5, max: 8 },
    estimatedReadyTime: '10:47 AM',
    stationWorkloads: {
      dosa_breakfast: 82,
      beverages: 0,
      snacks_frying: 0,
      hot_meals: 0,
      packaged_pickup: 0
    },
    statusHistory: [
      { status: 'placed', timestamp: '10:40 AM' }
    ]
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_dosa_batter',
    name: 'Fermented Dosa Batter',
    category: 'raw_material',
    unit: 'kg',
    currentStock: 18.5,
    reorderPoint: 15.0,
    safetyStock: 8.0,
    avgDailyUsage: 25.0,
    supplierLeadDays: 1,
    suggestedReorderQuantity: 30.0,
    lastRestockedDate: '2026-10-22',
    costPerUnit: 45
  },
  {
    id: 'inv_potatoes',
    name: 'Fresh Potatoes (Masala Grade)',
    category: 'raw_material',
    unit: 'kg',
    currentStock: 24.0,
    reorderPoint: 20.0,
    safetyStock: 10.0,
    avgDailyUsage: 18.0,
    supplierLeadDays: 1,
    suggestedReorderQuantity: 40.0,
    lastRestockedDate: '2026-10-21',
    costPerUnit: 22
  },
  {
    id: 'inv_fresh_milk',
    name: 'Full Cream Cow Milk',
    category: 'dairy',
    unit: 'liters',
    currentStock: 32.0,
    reorderPoint: 25.0,
    safetyStock: 12.0,
    avgDailyUsage: 45.0,
    supplierLeadDays: 1,
    suggestedReorderQuantity: 50.0,
    lastRestockedDate: '2026-10-23',
    costPerUnit: 58
  },
  {
    id: 'inv_coffee_powder',
    name: 'South Indian Filter Coffee Blend',
    category: 'raw_material',
    unit: 'kg',
    currentStock: 6.2,
    reorderPoint: 4.0,
    safetyStock: 2.0,
    avgDailyUsage: 3.5,
    supplierLeadDays: 2,
    suggestedReorderQuantity: 10.0,
    lastRestockedDate: '2026-10-18',
    costPerUnit: 420
  },
  {
    id: 'inv_cheese_slices',
    name: 'Amul Cheese Slices (Pack of 50)',
    category: 'dairy',
    unit: 'packets',
    currentStock: 2, // Low stock on purpose for testing alerts!
    reorderPoint: 5,
    safetyStock: 3,
    avgDailyUsage: 4,
    supplierLeadDays: 2,
    suggestedReorderQuantity: 10,
    lastRestockedDate: '2026-10-15',
    costPerUnit: 340,
    sku: 'SKU-CHZ-002'
  },
  {
    id: 'inv_bread_loaves',
    name: 'Sandwich Bread Jumbo Loaf',
    category: 'raw_material',
    unit: 'pieces',
    currentStock: 14,
    reorderPoint: 10,
    safetyStock: 5,
    avgDailyUsage: 12,
    supplierLeadDays: 1,
    suggestedReorderQuantity: 20,
    lastRestockedDate: '2026-10-23',
    costPerUnit: 35
  },
  {
    id: 'inv_lays_chips',
    name: 'Lays Magic Masala 50g',
    category: 'packaged_product',
    unit: 'packets',
    currentStock: 48,
    reorderPoint: 30,
    safetyStock: 15,
    avgDailyUsage: 25,
    supplierLeadDays: 3,
    suggestedReorderQuantity: 60,
    lastRestockedDate: '2026-10-20',
    costPerUnit: 16,
    sku: 'SKU-LAYS-BLU'
  },
  {
    id: 'inv_bingo_chips',
    name: 'Bingo Mad Angles Achaari 40g',
    category: 'packaged_product',
    unit: 'packets',
    currentStock: 28,
    reorderPoint: 20,
    safetyStock: 10,
    avgDailyUsage: 14,
    supplierLeadDays: 3,
    suggestedReorderQuantity: 40,
    lastRestockedDate: '2026-10-20',
    costPerUnit: 16,
    sku: 'SKU-BNG-ACH'
  },
  {
    id: 'inv_kurkure',
    name: 'Kurkure Masala Munch 45g',
    category: 'packaged_product',
    unit: 'packets',
    currentStock: 35,
    reorderPoint: 25,
    safetyStock: 12,
    avgDailyUsage: 18,
    supplierLeadDays: 3,
    suggestedReorderQuantity: 50,
    lastRestockedDate: '2026-10-20',
    costPerUnit: 16,
    sku: 'SKU-KK-MUNCH'
  },
  {
    id: 'inv_dairy_milk',
    name: 'Cadbury Dairy Milk 24g',
    category: 'packaged_product',
    unit: 'pieces',
    currentStock: 3, // Critical low stock for testing!
    reorderPoint: 25,
    safetyStock: 15,
    avgDailyUsage: 20,
    supplierLeadDays: 2,
    suggestedReorderQuantity: 50,
    lastRestockedDate: '2026-10-18',
    costPerUnit: 16,
    sku: 'SKU-CDM-24G'
  },
  {
    id: 'inv_kitkat',
    name: 'Nestlé KitKat 4-Finger',
    category: 'packaged_product',
    unit: 'pieces',
    currentStock: 32,
    reorderPoint: 20,
    safetyStock: 10,
    avgDailyUsage: 15,
    supplierLeadDays: 2,
    suggestedReorderQuantity: 40,
    lastRestockedDate: '2026-10-21',
    costPerUnit: 24,
    sku: 'SKU-NK-4F'
  },
  {
    id: 'inv_5star',
    name: 'Cadbury 5 Star 22g',
    category: 'packaged_product',
    unit: 'pieces',
    currentStock: 22,
    reorderPoint: 15,
    safetyStock: 8,
    avgDailyUsage: 12,
    supplierLeadDays: 2,
    suggestedReorderQuantity: 30,
    lastRestockedDate: '2026-10-19',
    costPerUnit: 16,
    sku: 'SKU-5ST-22G'
  },
  {
    id: 'inv_water_bottle',
    name: 'Aquafina Mineral Water 500ml',
    category: 'packaged_product',
    unit: 'pieces',
    currentStock: 85,
    reorderPoint: 40,
    safetyStock: 20,
    avgDailyUsage: 50,
    supplierLeadDays: 1,
    suggestedReorderQuantity: 100,
    lastRestockedDate: '2026-10-22',
    costPerUnit: 12,
    sku: 'SKU-AQ-500'
  }
];

export const INITIAL_ALERTS: OperationalAlert[] = [
  {
    id: 'alt_001',
    type: 'station_overload',
    severity: 'warning',
    title: 'Dosa Station Load at 82%',
    message: 'Workload at Dosa & Breakfast station exceeded 80% threshold with 3 queued batches (~18 mins backlog).',
    targetId: 'dosa_breakfast',
    timestamp: '10:30 AM',
    isAcknowledged: false,
    suggestedAction: 'Assign secondary staff to assist or increase griddle batch slots.'
  },
  {
    id: 'alt_002',
    type: 'critical_stock',
    severity: 'critical',
    title: 'Critical Low Stock: Cadbury Dairy Milk',
    message: 'Only 3 units remaining in shelf inventory. Estimated stockout in 1.2 hours based on today’s velocity.',
    targetId: 'inv_dairy_milk',
    timestamp: '10:15 AM',
    isAcknowledged: false,
    suggestedAction: 'Order replenishment from campus supplier immediately or transfer stock from central store.'
  },
  {
    id: 'alt_003',
    type: 'low_stock',
    severity: 'warning',
    title: 'Low Stock: Amul Cheese Slices',
    message: '2 packets remaining. Below safety reorder point of 5 packets.',
    targetId: 'inv_cheese_slices',
    timestamp: '09:45 AM',
    isAcknowledged: false,
    suggestedAction: 'Reorder 10 packs to cover evening grilled sandwich demand.'
  }
];
