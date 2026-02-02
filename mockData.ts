
import { Shop, Product, Order, ShopStatus, ShopCategory, OrderStatus } from './types';

export const initialShops: Shop[] = [
  {
    id: 'shop-1',
    ownerId: 'user-2',
    name: 'suresh',
    category: ShopCategory.FOOD,
    contact: '9876543210',
    location: { lat: 12.9716, lng: 77.5946, address: '4th Block, Koramangala, Bengaluru' },
    timing: { open: '09:00', close: '22:00' },
    status: ShopStatus.APPROVED,
    isOnline: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'shop-2',
    ownerId: 'user-3',
    name: 'Pharmacy Plus',
    category: ShopCategory.PHARMACY,
    contact: '9123456789',
    location: { lat: 12.9141, lng: 77.6413, address: 'HSR Layout, Bengaluru' },
    timing: { open: '08:00', close: '23:00' },
    status: ShopStatus.PENDING,
    isOnline: false,
    createdAt: new Date().toISOString()
  }
];

export const initialProducts: Product[] = [
  {
    id: 'p-1',
    shopId: 'shop-1',
    name: 'Butter Chicken',
    description: 'Creamy and rich tomato-based curry with tender chicken pieces',
    // Added missing mrp and discount fields to satisfy the Product interface
    mrp: 400.00,
    discount: 50.00,
    price: 350.00,
    category: 'Main',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=1000&auto=format&fit=crop',
    isEnabled: true,
    stock: 50,
    preparationTime: 25
  },
  {
    id: 'p-2',
    shopId: 'shop-1',
    name: 'Masala Dosa',
    description: 'Crispy rice pancake with spiced potato filling',
    // Added missing mrp and discount fields to satisfy the Product interface
    mrp: 100.00,
    discount: 20.00,
    price: 80.00,
    category: 'Breakfast',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=1000&auto=format&fit=crop',
    isEnabled: true,
    stock: 100,
    preparationTime: 10
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-101',
    shopId: 'shop-1',
    customerName: 'Rahul Sharma',
    items: [{ productId: 'p-1', name: 'Butter Chicken', quantity: 2, price: 350.00 }],
    total: 700.00,
    status: OrderStatus.RECEIVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ord-102',
    shopId: 'shop-1',
    customerName: 'Priya Verma',
    items: [{ productId: 'p-2', name: 'Masala Dosa', quantity: 3, price: 80.00 }],
    total: 240.00,
    status: OrderStatus.RECEIVED,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ord-103',
    shopId: 'shop-1',
    customerName: 'Amit Patel',
    items: [
      { productId: 'p-1', name: 'Butter Chicken', quantity: 1, price: 350.00 },
      { productId: 'p-2', name: 'Masala Dosa', quantity: 2, price: 80.00 }
    ],
    total: 510.00,
    status: OrderStatus.RECEIVED,
    createdAt: new Date().toISOString()
  }
];
