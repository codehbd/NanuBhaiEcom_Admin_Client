import {
  CreateShippingSchemaType,
  UpdateShippingSchemaType,
} from "@/validation/shipping.dto";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCookie() {
  const cookieObj = (await cookies()).get(
    process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai"
  );
  return cookieObj?.value;
}
export async function getAllShippingCostApi() {
  const res = await fetch(`${BASE_URL}/api/shipping/all`, {
    cache: "no-store",
    next: { tags: ["shipping"] },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch shipping costs!");
  }

  return res.json();
}
export async function getSingleShippingCostApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/shipping/${id}`, {
    cache: "no-store",
    next: { tags: ["shipping"] },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch single shipping cost!");
  }

  return res.json();
}
export async function createShippingCostApi(data: CreateShippingSchemaType) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/shipping/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to create shipping!");
  }

  return res.json();
}
export async function updateShippingCostApi(
  data: UpdateShippingSchemaType,
  id: string
) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/shipping/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to update shipping!");
  }

  return res.json();
}
export async function deleteShippingCostApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/shipping/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete shipping cost!");
  }
  return res.json();
}
