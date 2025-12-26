import { TUser } from "./user";

export type TOrderStatus =
  | "placed" // Order has been placed by user
  | "processing" // Seller is preparing the order
  | "shipping" // Order is shipped and on the way
  | "delivered" // Order has been delivered to the customer
  | "cancelled" // Order was cancelled (by user or system)
  | "returned" // Customer has returned the order
  | "refunded"; // Money has been refunded

export type TPaymentType = "cod" | "card" | "bkash" | "nagad";
export type TPaymentStatus = "not_paid" | "paid";

export interface TOrderItem {
  _id: number;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface TShippingAddress {
  _id: string;
  userId: string;
  street: string;
  city: string;
  postCode: number;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TOrder {
  _id: string;
  orderId: string;
  userId: string;
  shippingAddressId: string;
  totalAmount: number;
  discountAmount: number;
  grossAmount: number;
  shippingAmount: number;
  netAmount: number;
  status: TOrderStatus;
  paymentStatus: TPaymentStatus;
  paymentType: TPaymentType;
  createdAt: string; // ISO date string from API
  updatedAt: string; // ISO date string from API
  user?: TUser[]; // optional array from API
  orderitems: TOrderItem[];
  shippingaddress: TShippingAddress[];
}

export interface TMonthlySale {
  month: string;
  totalSales: number;
  totalOrders: number;
}
export interface TProfitSummery {
  totalGross: number;
  totalNet: number;
  totalOrders: number;
  profit: number;
  margin: number;
}

export interface TStockProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
}
