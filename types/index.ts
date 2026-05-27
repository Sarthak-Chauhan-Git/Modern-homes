export type UserRole = "admin" | "retail" | "wholesale";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type OrderType = "retail" | "wholesale";

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role: UserRole;
  gstin?: string;
  company_name?: string;
  created_at: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  sub_category: string;
  price_mrp: number;
  price_retail: number;
  price_wholesale: number;
  images: string[];
  in_stock: boolean;
  min_qty_wholesale: number;
  specs: Record<string, string>;
  featured: boolean;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  code: string;
  name: string;
  image: string;
  price_mrp: number;
  price_retail: number;
  price_wholesale: number;
  min_qty_wholesale: number;
  qty: number;
}

export interface OrderItem {
  product_id: string;
  code: string;
  name: string;
  qty: number;
  unit_price: number;
  total: number;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pin: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  discount_pct: number;
  discount_amount: number;
  total: number;
  shipping_address: Address;
  billing_address?: Address;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  gstin?: string;
  notes?: string;
  whatsapp_sent: boolean;
  created_at: string;
}

export interface DiscountSettings {
  id: string;
  type: OrderType;
  discount_pct: number;
  min_order_qty: number;
  min_order_value: number;
}

export interface CategoryTile {
  name: string;
  slug: string;
  image: string;
  count?: number;
}

export interface DiscountResult {
  pct: number;
  amount: number;
  total: number;
  eligible: boolean;
  reason?: string;
}
