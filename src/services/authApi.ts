import {
  ForgetPasswordSchemaType,
  LoginUserSchemaType,
  ResetPasswordSchemaType,
} from "@/validation/user.dto";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
async function getCookie() {
  const cookieObj = (await cookies()).get(
    process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai"
  );
  return cookieObj?.value;
}
export async function loginApi(data: LoginUserSchemaType) {
  const res = await fetch(`${BASE_URL}/api/user/admin-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Login failed!");
  }
  return res.json();
}

export async function userProfileApi() {
  const token = await getCookie();
  if (!token) return undefined; // no token, no user

  try {
    const res = await fetch(`${BASE_URL}/api/user`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return undefined;

    const result = await res.json();
    return result.user;
  } catch {
    return undefined;
  }
}

export async function logoutApi() {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/user/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Logout failed!");
  }
  return res.json();
}

export async function forgotPasswordApi(data: ForgetPasswordSchemaType) {
  const res = await fetch(`${BASE_URL}/api/user/forget-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Forgot password mail send failed!");
  }
  return res.json();
}

export async function resetPasswordApi(
  data: ResetPasswordSchemaType,
  token: string
) {
  const res = await fetch(`${BASE_URL}/api/user/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Reset password failed!");
  }
  return res.json();
}
