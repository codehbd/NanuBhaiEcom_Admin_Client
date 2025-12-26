"use server";

import {
  createProductApi,
  deleteProductApi,
  deleteProductImageApi,
  updateProductApi,
} from "@/services/productApi";
import { formDataToObject } from "@/utils";
import {
  createProductSchema,
  updateProductSchema,
} from "@/validation/product.dto";
import { revalidateTag } from "next/cache";
import zod from "zod";

export async function createProductAction(data: FormData) {
  try {
    const plainData = formDataToObject(data);
    const parsed = createProductSchema.safeParse(plainData);

    if (!parsed.success) {
      console.log(parsed.error);
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await createProductApi(data);
    revalidateTag("Product");
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

export async function updateProductAction(data: FormData, id: string) {
  const plainData = formDataToObject(data);
  const parsed = updateProductSchema.safeParse(plainData);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: zod.treeifyError(parsed.error).properties,
    } as const;
  }
  try {
    const response = await updateProductApi(data, id);
    revalidateTag("Product");
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}
export async function deleteProductAction(id: string) {
  try {
    const response = await deleteProductApi(id);
    revalidateTag("Product");
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
export async function deleteProductImageAction(id: string) {
  try {
    const response = await deleteProductImageApi(id);
    revalidateTag("Product");
    return {
      success: true,
      data: response,
    } as const;
  } catch (error: unknown) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}
