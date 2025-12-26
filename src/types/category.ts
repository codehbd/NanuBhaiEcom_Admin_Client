export interface TCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
  parentId: string | null;
  status: "active" | "inactive";
  createdAt: Date; // ISO date string
  updatedAt: Date; // ISO date string
  __v: number;
  subcategories: TCategory[]; // recursive type
}
