export type PhoneCondition = 'New' | 'Like New' | 'Used';

export interface PhoneVariant {
  id: string;
  color: string;
  colorHex: string;
  storage: string;
  price: number;
  stock: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Phone {
  id: string;
  brand: string;
  model: string;
  description: string;
  shortDescription: string;
  price: number; // Base price
  originalPrice?: number; // For flash sales
  images: string[];
  features: string[]; // Specs like 'Snapdragon 8 Gen 3', '6.8" AMOLED'
  rating: number;
  reviewsCount: number;
  condition: PhoneCondition;
  variants: PhoneVariant[];
  badges?: string[]; // e.g. 'Flash Sale', 'Best Seller'
  reviews: Review[];
}

export interface CartItem {
  id: string; // unique combo of phone + variant
  phone: Phone;
  variant: PhoneVariant;
  quantity: number;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress?: Address;
}
