"use server";

import {
  createCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
} from "@/services/categoryApi";
import { formDataToObject } from "@/utils";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/validation/category.dto";
import { revalidateTag } from "next/cache";
import zod from "zod";

export async function deleteCategoryAction(id: string) {
  try {
    const response = await deleteCategoryApi(id);
    revalidateTag("Category");
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
export async function createCategoryAction(data: FormData) {
  try {
    const plainData = formDataToObject(data);

    const parsed = createCategorySchema.safeParse(plainData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await createCategoryApi(data);
    revalidateTag("Category");
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
export async function updateCategoryAction(data: FormData, id: string) {
  try {
    const plainData = formDataToObject(data);

    const parsed = updateCategorySchema.safeParse(plainData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await updateCategoryApi(data, id);
    revalidateTag("Category");
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
