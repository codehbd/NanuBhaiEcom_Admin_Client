"use server";

import {
  createBrandApi,
  deleteBrandApi,
  updateBrandApi,
} from "@/services/brandApi";
import {
  CeateBrandSchemaType,
  createBrandSchema,
  updateBrandSchema,
  UpdateBrandSchemaType,
} from "@/validation/brand.dto";
import { revalidateTag } from "next/cache";
import zod from "zod";

export async function deleteBrandAction(id: string) {
  try {
    const response = await deleteBrandApi(id);
    revalidateTag("Brand");
    return {
      success: true,
      message: response?.messsage,
    } as const;
  } catch (error: unknown) {
    let message = "An unknown error occurred.";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      message,
    } as const;
  }
}

export async function createBrandAction(data: CeateBrandSchemaType) {
  try {
    const parsed = createBrandSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await createBrandApi(data);
    revalidateTag("Brand");
    return {
      success: true,
      data: response,
    } as const;
  } catch (error: unknown) {
    let message = "An unknown error occurred.";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      message,
    } as const;
  }
}

export async function updateBrandAction(
  data: UpdateBrandSchemaType,
  id: string
) {
  try {
    const parsed = updateBrandSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await updateBrandApi(data, id);
    revalidateTag("Brand");
    return {
      success: true,
      data: response,
    } as const;
  } catch (error: unknown) {
    let message = "An unknown error occurred.";
    if (error instanceof Error) {
      message = error.message;
    }
    return {
      success: false,
      message,
    } as const;
  }
}
