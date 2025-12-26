import zod from "zod";

export const createCategorySchema = zod.object({
  name: zod
    .string("Category name is required!")
    .trim()
    .nonempty("Category name is required!"),
  parentId: zod.string("Parent id must be a string").trim().optional(),

  image: zod
    .instanceof(File, { message: "Category image is required!" })
    .refine((file) => file instanceof File, "Category image is required!")
    .refine(
      (file) =>
        file instanceof File &&
        ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      "Only JPEG, PNG, SVG images are allowed!"
    )
    .refine(
      (file) => file instanceof File && file.size <= 2 * 1024 * 1024,
      "Image must not be greater than 2MB!"
    ),
});

export const updateCategorySchema = zod.object({
  name: zod.string("Category name is required!").trim().optional(),
  parentId: zod.string("Parent id must be a string").trim().optional(),

  image: zod
    .instanceof(File, { message: "Category image is required!" })
    .refine(
      (file) =>
        file instanceof File &&
        ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type),
      "Only JPEG, PNG, SVG images are allowed!"
    )
    .refine(
      (file) => file instanceof File && file.size <= 2 * 1024 * 1024,
      "Image must not be greater than 2MB!"
    )
    .optional(),
});

// Types
export type CeateCategorySchemaType = zod.infer<typeof createCategorySchema>;
export type UpdateCategorySchemaType = zod.infer<typeof updateCategorySchema>;
