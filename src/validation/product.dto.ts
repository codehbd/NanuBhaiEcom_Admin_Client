import zod from "zod";

export const createProductSchema = zod.object({
  name: zod
    .string("Product name must be a string")
    .trim()
    .nonempty("Product name is required!"),
  categoryId: zod
    .string("Category id must be a string")
    .trim()
    .nonempty("Category id is required!"),
  brandId: zod.string("Brand id must be a string").trim().optional(),
  description: zod
    .string("Product description must be a string")
    .trim()
    .nonempty("Product description is required!"),
  price: zod.coerce
    .number("Product price must be number")
    .positive("Product price must be positive")
    .min(1, "Product price is required!"),
  previousPrice: zod.coerce
    .number("Previous price must be number")
    .nonnegative("Previous price must be 0 or positive")
    .optional(),
  extraPrice: zod.coerce
    .number("Extra price must be number")
    .nonnegative("Previous price must be 0 or positive")
    .optional(),
  stock: zod.coerce
    .number("Stock must be number")
    .positive("Stock must be positive")
    .min(1, "Product stock is required!"),
  featured: zod.enum(["true", "false"], "Invalid featured status").optional(),
  location: zod
    .enum([
      "Barishal",
      "Chattogram",
      "Dhaka",
      "Khulna",
      "Mymensingh",
      "Rajshahi",
      "Rangpur",
      "Sylhet",
    ])
    .optional(),
  freeDelivery: zod
    .enum(["true", "false"], "Invalid free delivery status")
    .optional(),
  images: zod
    .array(zod.instanceof(File))
    .min(1, "At least 1 product image is required!")
    .refine(
      (files) =>
        files.every((file) => ["image/jpeg", "image/png"].includes(file.type)),
      {
        message: "Only JPEG, PNG images are allowed!",
      }
    )
    .refine((files) => files.every((file) => file.size <= 2 * 1024 * 1024), {
      message: "Each image must not be greater than 2MB!",
    }),
});

export const updateProductSchema = zod.object({
  name: zod.string("Product name must be string").trim().optional(),
  categoryId: zod.string("Category id must be string").trim().optional(),
  brandId: zod.string("Brand id must be a string").trim().optional(),
  description: zod
    .string("Product description must be string")
    .trim()
    .optional(),
  price: zod.coerce
    .number("Product price must be a number")
    .nonnegative("Product price must be positive")
    .optional(),
  previousPrice: zod.coerce
    .number("Previous price must be a number")
    .nonnegative("Previous price must be positive")
    .optional(),
  extraPrice: zod.coerce
    .number("Extra price must be number")
    .nonnegative("Extra price must be positive")
    .optional(),
  stock: zod.coerce
    .number("Stock must be a number")
    .nonnegative("Stock must be positive")
    .optional(),
  featured: zod.enum(["true", "false"], "Invalid featured status").optional(),
  location: zod
    .enum([
      "Barishal",
      "Chattogram",
      "Dhaka",
      "Khulna",
      "Mymensingh",
      "Rajshahi",
      "Rangpur",
      "Sylhet",
    ])
    .optional(),
  freeDelivery: zod
    .enum(["true", "false"], "Invalid free delivery status")
    .optional(),
  status: zod.enum(["active", "inactive"], "Invalid status").optional(),
  images: zod
    .union([zod.array(zod.instanceof(File)), zod.null(), zod.undefined()])
    .optional()
    .refine(
      (files) =>
        !files ||
        files.every((file) => ["image/jpeg", "image/png"].includes(file.type)),
      {
        message: "Only JPEG, PNG images are allowed!",
      }
    )
    .refine(
      (files) => !files || files.every((file) => file.size <= 2 * 1024 * 1024),
      {
        message: "Each image must not be greater than 2MB!",
      }
    ),
});

export const activeInactiveProductSchema = zod.object({
  status: zod.enum(["active", "inactive"], "Invalid status"),
});

export const productImageUploadSchema = zod.object({
  productId: zod
    .string("Product id must be string")
    .trim()
    .nonempty("Product id is required!"),
});

export const addProductVarientSchema = zod.object({
  productId: zod
    .string("Product id must be string")
    .trim()
    .nonempty("Product id is required!"),
  varientId: zod
    .string("Varient id must be string")
    .trim()
    .nonempty("Varient id is required!"),
});
export const removeProductVarientSchema = zod.object({
  productId: zod
    .string("Product id must be string")
    .trim()
    .nonempty("Product id is required!"),
});

// Types
export type CreateProductSchemaType = zod.infer<typeof createProductSchema>;
export type UpdateProductSchemaType = zod.infer<typeof updateProductSchema>;
