"use server";

import {
  activeInactiveDiscountApi,
  createDiscountApi,
  createDiscountTierApi,
  deleteDiscountApi,
  deleteDiscountTierApi,
  updateDiscountApi,
} from "@/services/discountsApi";
import {
  activeInactiveDiscountSchema,
  ActiveInactiveDiscountSchemaType,
  createDiscountSchema,
  createDiscountTierSchema,
  CreateDiscountTierSchemaType,
} from "@/validation/discount.dto";

import { revalidateTag } from "next/cache";
import zod from "zod";

// Type for serialized discount data (dates as ISO strings) passed from client
export type SerializedDiscountData = {
  name: string;
  type: "product" | "category" | "coupon" | "quantity";
  method: "percentage" | "flat" | "tier" | "bogo";
  value?: number;
  code?: string;
  minQty?: number;
  productIds?: string[];
  categoryIds?: string[];
  tierIds?: string[];
  minCartValue?: number;
  usageLimit?: number;
  startDate: string;
  endDate: string;
};

export async function createDiscountAction(data: SerializedDiscountData) {
  try {
    const parsed = createDiscountSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    // Use original input data (with string dates) instead of parsed data (with Dayjs dates)
    const response = await createDiscountApi(data);
    revalidateTag("discount");
    return {
      success: true,
      data: response,
    } as const;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}
export async function updateDiscountAction(
  data: SerializedDiscountData,
  id: string
) {
  try {
    const parsed = createDiscountSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    // Use original input data (with string dates) instead of parsed data (with Dayjs dates)
    const response = await updateDiscountApi(data, id);
    revalidateTag("discount");
    return {
      success: true,
      data: response,
    } as const;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}
export async function createDiscountTierAction(
  data: CreateDiscountTierSchemaType
) {
  try {
    const parsed = createDiscountTierSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await createDiscountTierApi(parsed.data);
    revalidateTag("discount-tier");
    return {
      success: true,
      data: response,
    } as const;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}
export async function deleteDiscountTierAction(id: string) {
  try {
    const response = await deleteDiscountTierApi(id);
    revalidateTag("discount-tier");
    return {
      success: true,
      data: response,
    } as const;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}
export async function deleteDiscountAction(id: string) {
  try {
    const response = await deleteDiscountApi(id);
    revalidateTag("discount");
    return {
      success: true,
      data: response,
    } as const;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}
export async function activeInactiveDiscountAction(
  data: ActiveInactiveDiscountSchemaType,
  id: string
) {
  try {
    const parsed = activeInactiveDiscountSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await activeInactiveDiscountApi(data, id);
    revalidateTag("discount");
    return {
      success: true,
      data: response,
    } as const;
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}
