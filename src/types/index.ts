export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  size: string;
  price: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: number | null;
  category?: Category | null;
  variants: ProductVariant[];
  createdAt: string;
}

export type UserRole = 'admin' | 'customer';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  productId: number | null;
  variantId: number | null;
  productName: string;
  size: string;
  quantity: number;
  unitPrice: string;
}

export interface Order {
  id: number;
  userId: number | null;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  status: OrderStatus;
  totalAmount: string;
  createdAt: string;
  items: OrderItem[];
}

export interface CartItem {
  variantId: number;
  productId: number;
  name: string;
  size: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  stock: number;
}
