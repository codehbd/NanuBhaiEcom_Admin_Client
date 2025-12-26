import zod from "zod";

export const createShippingSchema = zod.object({
  division: zod.enum(
    [
      "Barishal",
      "Chattogram",
      "Dhaka",
      "Khulna",
      "Rajshahi",
      "Rangpur",
      "Mymensingh",
      "Sylhet",
    ],
    "Invalid division name!"
  ),
  cost: zod.coerce
    .number("Cost must be number!")
    .nonnegative("Cost must be positive!")
    .min(1, "Cost is required!"),
});
export const updateShippingSchema = zod.object({
  division: zod.string("Division name must be string!").trim().optional(),
  cost: zod.coerce
    .number("Cost must be number!")
    .nonnegative("Cost must be positive!")
    .optional(),
});

// Types
export type CreateShippingSchemaType = zod.infer<typeof createShippingSchema>;
export type UpdateShippingSchemaType = zod.infer<typeof updateShippingSchema>;
