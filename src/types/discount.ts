export interface TDiscountTier {
  _id: string;
  min: number;
  value: number;
}
export interface TDiscount {
  _id: string;
  name: string;
  type: "product" | "category" | "coupon" | "quantity";
  method: "percentage" | "flat" | "bogo" | "tier";
  value: number;
  minQty?: number;
  minCartValue?: number;
  code?: string;
  usageLimit?: number;
  usedCount?: number;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
}
