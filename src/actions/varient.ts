"use server";

import {
  createVarientAttributesApi,
  deleteVarientAttributesApi,
} from "@/services/varientAttributesApi";
import {
  createVarientApi,
  deleteVarientApi,
  updateVarientApi,
} from "@/services/varientsApi";
import { formDataToObject } from "@/utils";
import {
  CreateAttributeVarientSchemaType,
  createVarientAttributeSchema,
  createVarientSchema,
  updateVarientSchema,
} from "@/validation/varient.dto";
import { revalidateTag } from "next/cache";
import zod from "zod";

export async function deleteVarientAction(id: string) {
  try {
    const response = await deleteVarientApi(id);
    revalidateTag("Varient");
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
export async function createVarientAction(data: FormData) {
  try {
    const plainData = formDataToObject(data);

    const parsed = createVarientSchema.safeParse(plainData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await createVarientApi(data);
    revalidateTag("Varient");
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
export async function updateVarientAction(data: FormData, id: string) {
  try {
    const plainData = formDataToObject(data);

    const parsed = updateVarientSchema.safeParse(plainData);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await updateVarientApi(data, id);
    revalidateTag("Varient");
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

export async function createVarientAttributeAction(
  data: CreateAttributeVarientSchemaType
) {
  try {
    const parsed = createVarientAttributeSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }
    const response = await createVarientAttributesApi(data);
    revalidateTag("varient-attr");
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

export async function deleteVarientAttributeAction(id: string) {
  try {
    const response = await deleteVarientAttributesApi(id);
    revalidateTag("varient-attr");
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
