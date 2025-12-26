import zod from "zod";

export const createVarientSchema = zod.object({
  productId: zod
    .string("Product Id must be string!")
    .trim()
    .nonempty("Product Id is required!"),
  sku: zod.string("SKU must be string!").trim().nonempty("SKU is required!"),
  price: zod.coerce
    .number("Varient price must be number")
    .positive("Varient price must be positive")
    .min(1, "Varient price is required!"),
  stock: zod.coerce
    .number("Stock must be number")
    .positive("Stock must be positive")
    .min(1, "Stock is required!"),
  image: zod
    .instanceof(File, { message: "Category image is required!" })
    .refine((file) => file instanceof File, "Category image is required!")
    .refine(
      (file) =>
        file instanceof File && ["image/jpeg", "image/png"].includes(file.type),
      "Only JPEG, PNG images are allowed!"
    )
    .refine(
      (file) => file instanceof File && file.size <= 2 * 1024 * 1024,
      "Image must not be greater than 2MB!"
    ),
});

export const updateVarientSchema = zod.object({
  productId: zod.string("Product Id must be string!").trim().optional(),
  sku: zod.string("SKU must be string!").trim().optional(),
  price: zod.coerce
    .number("Varient price must be number")
    .positive("Varient price must be positive")
    .optional(),
  stock: zod.coerce
    .number("Stock must be number")
    .positive("Stock must be positive")
    .optional(),
  image: zod
    .instanceof(File, { message: "Category image is required!" })
    .refine((file) => file instanceof File, "Category image is required!")
    .refine(
      (file) =>
        file instanceof File && ["image/jpeg", "image/png"].includes(file.type),
      "Only JPEG, PNG images are allowed!"
    )
    .refine(
      (file) => file instanceof File && file.size <= 2 * 1024 * 1024,
      "Image must not be greater than 2MB!"
    )
    .optional(),
});
export const createVarientAttributeSchema = zod.object({
  name: zod
    .string("Attribute name must be string!")
    .trim()
    .nonempty("Attribute name is required!"),
  value: zod
    .string("Attribute value must be string!")
    .trim()
    .nonempty("Attribute value is required!"),
});

// Types
export type CeateVarientSchemaType = zod.infer<typeof createVarientSchema>;
export type UpdateVarientSchemaType = zod.infer<typeof updateVarientSchema>;
export type CreateAttributeVarientSchemaType = zod.infer<
  typeof createVarientAttributeSchema
>;
