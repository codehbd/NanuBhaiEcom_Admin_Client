"use server";

import { forgotPasswordApi, loginApi, logoutApi, resetPasswordApi } from "@/services/authApi";
import {

  ForgetPasswordSchemaType,
  LoginUserSchemaType,
  ResetPasswordSchemaType,
  forgetPasswordSchema,
  loginUserSchema,
  resetUserPasswordSchema,
} from "@/validation/user.dto";
import { cookies } from "next/headers";
import zod from "zod";

export async function loginAction(data: LoginUserSchemaType) {
  try {
    const parsed = loginUserSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }

    const response = await loginApi(parsed.data);
    
    (await cookies()).set({
      name: process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai",
      value: response.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 days
    });
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

export async function logoutAction() {
  try {
    const response = await logoutApi();
    (await cookies()).delete(process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai");
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

export async function forgotPasswordAction(data: ForgetPasswordSchemaType) {
  try {
    const parsed = forgetPasswordSchema.safeParse(data);

    if (!parsed.success) {
      return {
        success: false,
        fieldErrors: zod.treeifyError(parsed.error).properties,
      } as const;
    }

    const response = await forgotPasswordApi(parsed.data);
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred.",
    } as const;
  }
}

export async function resetPasswordAction(data: ResetPasswordSchemaType,token : string) {
  try {
    const parsed = resetUserPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: zod.treeifyError(parsed.error).properties,
    } as const;
  }

    const response = await resetPasswordApi(parsed.data,token);
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