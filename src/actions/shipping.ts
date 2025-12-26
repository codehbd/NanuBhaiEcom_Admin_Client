"use server";
import {
  createShippingCostApi,
  deleteShippingCostApi,
} from "@/services/shippingCostApi";
import {
  createShippingSchema,
  CreateShippingSchemaType,
} from "@/validation/shipping.dto";
import { revalidateTag } from "next/cache";
import zod from "zod";

export async function createShippingCostAction(data: CreateShippingSchemaType) {
  try {
    const parsed = createShippingSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await createShippingCostApi(data);
    revalidateTag("shipping");
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
export async function deleteShippingCostAction(id: string) {
  try {
    const response = await deleteShippingCostApi(id);
    revalidateTag("shipping");
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
