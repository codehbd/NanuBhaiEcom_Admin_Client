
export interface TBrand{
 _id : string;
 name : string;
 status : "active" | "inactive";
  createdAt: Date; // ISO date string
  updatedAt: Date; // ISO date string
 __v: number;
}