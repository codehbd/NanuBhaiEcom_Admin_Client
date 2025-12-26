"use server";

import { changeOrderStatusApi, deleteOrderApi } from "@/services/orderApi";
import { changeOrderStatusSchema, ChangeOrderStatusSchemaType } from "@/validation/order.dto";
import { revalidateTag } from "next/cache";
import zod from "zod";

export async function changeOrderStatusAction(data: ChangeOrderStatusSchemaType,id : string) {
  try {
    const parsed = changeOrderStatusSchema.safeParse(data);

     if (!parsed.success) {
          return {
            success: false,
            fieldErrors: zod.treeifyError(parsed.error).properties,
          } as const;
        }

    const response = await changeOrderStatusApi(parsed.data,id);
    revalidateTag("Order");
    return {
      success: true,
      data : response
    } as const;
  } catch (error) {
     return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}

export async function deleteOrderAction(id : string) {
  try {
    const response = await deleteOrderApi(id);
    revalidateTag("Order");
    return {
      success: true,
      data : response
    } as const;
  } catch (error) {
     return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}