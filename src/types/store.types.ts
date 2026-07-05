export interface Store {
  id: string;
  ownerId: string;
  brandName: string;
  slug: string;
  logo?: string | null;
  banner?: string | null;
  country: string;
  currency: string;
  description?: string | null;
  isPublished: boolean;
  isSuspended: boolean;
  plan: "FREE" | "PRO" | "ENTERPRISE";
  theme?: Record<string, unknown> | null;
  shipping?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  storeId: string;
  parentId?: string | null;
  name: string;
  slug: string;
  image?: string | null;
  children?: Category[];
}

export interface Collection {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  image?: string | null;
  isFeatured: boolean;
}

export interface ProductSizeChart {
  note?: string;
  columns: string[];
  rows: string[][];
}

export interface ProductDetails {
  specifications?: string[];
  careInstructions?: string[];
  sizeChart?: ProductSizeChart;
  deliveryOverride?: string | null;
  colorImages?: Record<string, string>;
}

export interface StoreShippingConfig {
  deliveryPolicy?: string;
  insideRate?: number;
  outsideRate?: number;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description?: string | null;
  price: number;
  discountPrice?: number | null;
  categoryId?: string | null;
  collectionId?: string | null;
  stock: number;
  sku?: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  tags: string[];
  details?: ProductDetails | null;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  category?: Category | null;
  collection?: Collection | null;
  reviews?: Review[];
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface Order {
  id: string;
  storeId: string;
  orderNumber: string;
  status: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentMethod: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress: Record<string, string>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string | null;
  createdAt: string;
}

export interface Customer {
  id: string;
  storeId: string;
  email: string;
  name: string;
  phone?: string | null;
  orderCount: number;
  totalSpent: number;
  hasAccount?: boolean;
  createdAt?: string;
  orders?: Order[];
}

export interface StorefrontCustomer {
  id: string;
  storeId: string;
  email: string;
  name: string;
  phone?: string | null;
}

export interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export interface Review {
  id: string;
  storeId: string;
  productId: string;
  rating: number;
  comment?: string | null;
  guestName?: string | null;
  guestEmail?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reply?: string | null;
  createdAt?: string;
  product?: { id: string; name: string; images: string[] };
}

export interface Coupon {
  id: string;
  storeId: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minOrder: number;
  usageLimit?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  isActive: boolean;
}

export interface AnalyticsOverview {
  revenue: number;
  orders: number;
  products: number;
  customers: number;
  recentOrders: Order[];
  bestSellers: Array<{ productId: string; name: string; quantity: number; revenue: number }>;
}
