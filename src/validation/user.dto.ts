import zod from "zod";

export const loginUserSchema = zod.object({
  email: zod.email("Invalid email!").trim().nonempty("Email is required!"),
  password: zod
    .string("Password must be a string!")
    .trim()
    .nonempty("Password is required!"),
});

export const updateUserProfileSchema = zod.object({
  name: zod.string("Name must be a string!").trim().optional(),
  phone: zod
    .string("Phone number must be a string!")
    .trim()
    .regex(/^(01)[0-9]{9}$/, "Invalid phone number!")
    .optional(),
});

export const updateUserPasswordSchema = zod.object({
  oldPassword: zod
    .string("Old password must be a string!")
    .trim()
    .nonempty("Old password is required!")
    .min(8, "Old password must be at least 8 character!"),
  newPassword: zod
    .string("New password must be a string!")
    .trim()
    .nonempty("New password is required!")
    .min(8, "New password must be at least 8 character!"),
  confirmPassword: zod
    .string("Confirm password must be a string!")
    .trim()
    .nonempty("Confirm password is required!")
    .min(8, "Confirm password must be at least 8 character!"),
});

export const forgetPasswordSchema = zod.object({
  email: zod.email("Invalid email!").trim().nonempty("Email is required!"),
});

export const resetUserPasswordSchema = zod.object({
  newPassword: zod
    .string()
    .min(8, "New password must be at least 8 character!")
    .nonempty("New password is required!"),
  confirmPassword: zod
    .string()
    .min(8, "Confirm password must be at least 8 character!")
    .nonempty("Confirm password is required!"),
});

export const blockUnblockUserSchema = zod.object({
  status: zod.enum(["active", "inactive"], "Invalid status!"),
});


// Types
export type LoginUserSchemaType = zod.infer<typeof loginUserSchema>;
export type ForgetPasswordSchemaType = zod.infer<typeof forgetPasswordSchema>;
export type ResetPasswordSchemaType = zod.infer<typeof resetUserPasswordSchema>;
