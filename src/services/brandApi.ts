import {
  CeateBrandSchemaType,
  UpdateBrandSchemaType,
} from "@/validation/brand.dto";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCookie() {
  const cookieObj = (await cookies()).get(
    process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai"
  );
  return cookieObj?.value;
}
export async function getAllBrandsApi() {
  const res = await fetch(`${BASE_URL}/api/brand/all`, {
    cache: "no-store",
    next: { tags: ["Brand"] },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch brands!");
  }

  return res.json();
}
export async function getSingleBrandApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/brand/${id}`, {
    cache: "no-store",
    next: { tags: ["Brand"] },
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch brand!");
  }

  return res.json();
}

export async function createBrandApi(data: CeateBrandSchemaType) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/brand/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to create brand!");
  }

  return res.json();
}

export async function updateBrandApi(data: UpdateBrandSchemaType, id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/brand/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to update brand!");
  }

  return res.json();
}

export async function deleteBrandApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/brand/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete brand!");
  }

  return res.json();
}
