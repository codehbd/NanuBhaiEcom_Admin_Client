import zod from "zod";

export const createBrandSchema = zod.object({
  name: zod
    .string("Brand name is required!")
    .trim()
    .nonempty("Brand name is required!"),
});
export const updateBrandSchema = zod.object({
  name: zod
    .string("Brand name is required!")
    .trim()
    .optional(),
});

// Types
export type CeateBrandSchemaType = zod.infer<typeof createBrandSchema>;
export type UpdateBrandSchemaType = zod.infer<typeof updateBrandSchema>;
