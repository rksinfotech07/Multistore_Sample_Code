
export enum UserRole {
  ADMIN = 'ADMIN',
  SHOP = 'SHOP'
}

export enum ShopStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED'
}

export enum ShopCategory {
  FOOD = 'Food',
  GROCERY = 'Grocery',
  PHARMACY = 'Pharmacy',
  ELECTRONICS = 'Electronics',
  COSMETICS = 'Cosmetics'
}

export enum OrderStatus {
  RECEIVED = 'Received',
  ACCEPTED = 'Accepted',
  PREPARING = 'Preparing',
  READY_FOR_PICKUP = 'Ready for Pickup',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  category: ShopCategory;
  contact: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  timing: {
    open: string;
    close: string;
  };
  status: ShopStatus;
  isOnline: boolean;
  logo?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  description: string;
  mrp: number;
  discount: number;
  price: number; // Final Selling Price
  category: string;
  image: string;
  isEnabled: boolean;
  stock: number;
  // Category specific fields
  // Food
  preparationTime?: number;
  isVeg?: boolean;
  customizationAvailable?: boolean;
  // Grocery
  unitType?: string;
  quantityPerUnit?: string;
  expiryDate?: string;
  // Electronics
  brand?: string;
  modelNumber?: string;
  warrantyPeriod?: string;
  isReturnable?: boolean;
  // Pharmacy
  requiresPrescription?: boolean;
  batchNumber?: string;
  // Cosmetics
  skinType?: string;
  ingredients?: string;
}

export interface Order {
  id: string;
  shopId: string;
  customerName: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  rejectionReason?: string;
  deliveryPartner?: {
    name: string;
    phone: string;
    status: 'Assigned' | 'Arrived' | 'Handed Over';
  };
}
