export interface TVariant {
  _id: string;
  productId: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  createdAt: Date; // ISO date string
  updatedAt: Date; // ISO date string
  __v: number;
}
