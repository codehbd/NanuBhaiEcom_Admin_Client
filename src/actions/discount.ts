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
  CreateDiscountSchemaType,
  createDiscountTierSchema,
  CreateDiscountTierSchemaType,
} from "@/validation/discount.dto";

import { revalidateTag } from "next/cache";
import zod from "zod";

export async function createDiscountAction(data: CreateDiscountSchemaType) {
  try {
    const parsed = createDiscountSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await createDiscountApi(parsed.data);
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
  data: CreateDiscountSchemaType,
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
    const response = await updateDiscountApi(parsed.data, id);
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
