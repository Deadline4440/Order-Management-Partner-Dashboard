export type Product = {
  id: string;
  sku: string;
  name: string;
  mrp: number;
  price: number;
  unit: string;
  packSize: string;
  stock: number;
  image: {
      id: string;
      hint: string;
  };
  // Optional product weight metadata
  soldBy?: 'unit' | 'bag'; // how the product is sold
  weightKg?: number; // weight per unit in kg (for 'unit')
  bagWeightKg?: number; // weight per bag in kg (for 'bag')
};

export const user = {
  name: 'My',
  email: 'dayal@dist.com',
  partnerCode: 'DYL-001',
};

export const dashboardStats = [
  {
    title: 'Outstanding Amount',
    value: '₹1,25,430.00',
    change: '+5.2% from last month',
    icon: 'IndianRupee',
  },
  {
    title: 'Pending Orders',
    value: '12',
    change: '+2 since yesterday',
    icon: 'Package',
  },
  {
    title: 'New Offers',
    value: '3',
    change: 'Ending soon',
    icon: 'TicketPercent',
  },
  {
    title: 'Delivered Orders',
    value: '153',
    change: 'This month',
    icon: 'Truck',
  },
];

export const products: Product[] = [
  {
    id: 'prod-001',
    sku: 'DYL-UT-001',
    name: 'ucw Ultra Detergent',
    mrp: 250.0,
    price: 199.0,
    unit: 'kg',
    packSize: '2 kg',
    stock: 500,
    image: {
        id: "product-1",
        hint: "detergent powder"
    },
    soldBy: 'bag',
    bagWeightKg: 2
  },
  {
    id: 'prod-002',
    sku: 'DYL-LIQ-010',
    name: 'Dishwash Liquid - Shine',
    mrp: 120.0,
    price: 95.0,
    unit: 'ltr',
    packSize: '1 L',
    stock: 300,
    image: {
        id: "product-2",
        hint: "dishwash liquid"
    },
    soldBy: 'unit',
    weightKg: 1.0
  },
  {
    id: 'prod-003',
    sku: 'DYL-FLO-100',
    name: 'Floor Cleaner - Fresh',
    mrp: 80.0,
    price: 70.0,
    unit: 'ltr',
    packSize: '1 L',
    stock: 400,
    image: {
        id: "product-3",
        hint: "floor cleaner"
    }
  },
  {
    id: 'prod-004',
    sku: 'DYL-GLA-200',
    name: 'Glass Cleaner',
    mrp: 90.0,
    price: 75.0,
    unit: 'ml',
    packSize: '500 ml',
    stock: 250,
    image: {
        id: "product-4",
        hint: "glass cleaner"
    },
    soldBy: 'unit',
    weightKg: 0.5
  },

  {
    id: 'prod-005',
    sku: 'DYL-TOL-300',
    name: 'Toilet Cleaner',
    mrp: 110.0,
    price: 89.0,
    unit: 'ltr',
    packSize: '1 L',
    stock: 180,
    image: {
        id: "product-5",
        hint: "toilet cleaner"
    }
  },
  {
    id: 'prod-006',
    sku: 'DYL-MUL-400',
    name: 'Multi-Surface Cleaner',
    mrp: 150.0,
    price: 125.0,
    unit: 'ltr',
    packSize: '1.5 L',
    stock: 220,
    image: {
        id: "product-6",
        hint: "surface cleaner"
    },
    soldBy: 'unit',
    weightKg: 1.5
  },

];

export const orders = [
  {
    id: 'ORD-20251124-001',
    date: '2025-11-24',
    amount: 1990.0,
    status: 'Delivered',
    items: [
        {...products[0], quantity: 10}
    ],
    shippingAddress: 'Near Station Road, Lucknow, Uttar Pradesh, 226001',
    expectedDelivery: '2025-11-28',
    trackingNumber: 'TRK123456789',
    courier: 'Blue Dart'
  },
  {
    id: 'ORD-20251120-003',
    date: '2025-11-20',
    amount: 1235.0,
    status: 'Dispatched',
    items: [
        {...products[1], quantity: 5},
        {...products[2], quantity: 10},
    ],
    shippingAddress: 'Near Station Road, Lucknow, Uttar Pradesh, 226001',
    expectedDelivery: '2025-11-25',
    trackingNumber: 'TRK987654321',
    courier: 'Delhivery'
  },
  {
    id: 'ORD-20251115-002',
    date: '2025-11-15',
    amount: 3200.0,
    status: 'Packed',
    items: [
        {...products[3], quantity: 20},
        {...products[4], quantity: 10},
        {...products[5], quantity: 5},
    ],
    shippingAddress: 'Near Station Road, Lucknow, Uttar Pradesh, 226001',
    expectedDelivery: '2025-11-22',
    trackingNumber: null,
    courier: null
  },
  {
    id: 'ORD-20251110-001',
    date: '2025-11-10',
    amount: 540.0,
    status: 'Placed',
    items: [
        {...products[0], quantity: 2},
        {...products[1], quantity: 1},
    ],
    shippingAddress: 'Near Station Road, Lucknow, Uttar Pradesh, 226001',
    expectedDelivery: '2025-11-18',
    trackingNumber: null,
    courier: null
  },
];


export const ledger = [
    { date: '2025-11-24', type: 'Invoice', ref: 'ORD-20251124-001', debit: 1990.00, credit: 0, balance: 125430.00 },
    { date: '2025-11-22', type: 'Payment', ref: 'PAY-00567', debit: 0, credit: 15000.00, balance: 123440.00 },
    { date: '2025-11-20', type: 'Invoice', ref: 'ORD-20251120-003', debit: 1235.00, credit: 0, balance: 138440.00 },
    { date: '2025-11-15', type: 'Invoice', ref: 'ORD-20251115-002', debit: 3200.00, credit: 0, balance: 137205.00 },
    { date: '2025-11-10', type: 'Invoice', ref: 'ORD-20251110-001', debit: 540.00, credit: 0, balance: 134005.00 },
    { date: '2025-11-05', type: 'Payment', ref: 'PAY-00560', debit: 0, credit: 25000.00, balance: 133465.00 },
];


export const aiPartnerData = {
    partnerId: 'DYL-001',
    customerDemographics: 'Urban and semi-urban households in Uttar Pradesh, India. Mid to high-income families, tech-savvy, looking for quality home care products.',
    orderHistory: 'Frequent orders of high-volume SKUs like detergent powders (2kg packs) and dishwash liquids. Lower but consistent orders for specialized cleaners like glass and toilet cleaners. Seasonal spike in floor cleaner sales during monsoons.',
    marketTrends: 'Growing demand for eco-friendly and natural cleaning products. Increased online search for "quick cleaning hacks" and "multi-purpose cleaners". Competitors are launching smaller, trial-sized packs to attract new customers.'
};

export const schemeRewards = [
    { name: "Window AC 1.5 Ton", points: 125, imageId: "reward-ac-window" },
    { name: "Split AC 3 Star 1.5 Ton", points: 150, imageId: "reward-ac-split" },
    { name: "Hero Motorcycle", points: 250, imageId: "reward-motorcycle" },
    { name: "Gas Water Geyser-6 Ltr", points: 30, imageId: "reward-geyser" },
    { name: "Laptop", points: 200, imageId: "reward-laptop" },
    { name: "Soap - 10pc", points: 0.5, imageId: "reward-soap" },
];
