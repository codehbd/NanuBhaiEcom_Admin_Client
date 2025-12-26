import zod from "zod";


export const changeOrderStatusSchema = zod.object({
  status: zod
    .enum([
        "placed",
        "processing",
        "shipping",
        "delivered",
        "cancelled",
        "returned",
        "refunded",
      ], "Invalid staus")
    .optional(),
  paymentStatus: zod
    .enum(["not_paid", "paid"], "Invalid payment status")
    .optional(),
});

// Types
export type ChangeOrderStatusSchemaType = zod.infer<typeof changeOrderStatusSchema>;
