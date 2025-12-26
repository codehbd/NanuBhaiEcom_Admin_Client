import { TBrand } from "./brand";
import { TCategory } from "./category";
import { TVariant } from "./varient";

export interface TProductImage {
  _id: string;
  productId: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TProduct {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  brandId: string;
  description: string;
  price: number;
  previousPrice: number | null;
  extraPrice: number | null;
  stock: number;
  sold: number;
  rating: number;
  featured: boolean;
  freeDelivery: boolean;
  location: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  category: TCategory[];
  brand: TBrand[];
  images: TProductImage[];
  variants: TVariant[];
}
