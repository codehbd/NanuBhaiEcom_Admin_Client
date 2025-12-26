"use server";

import { CreateAttributeVarientSchemaType } from "@/validation/varient.dto";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCookie() {
  const cookieObj = (await cookies()).get(
    process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai"
  );
  return cookieObj?.value;
}

export async function getAllVarientAttributesApi() {
  const token = await getCookie();

  const res = await fetch(`${BASE_URL}/api/varient-attribute/all`, {
    cache: "no-store",
    next: { tags: ["varient-attr"] },
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch varient attributes!");
  }

  return res.json();
}
export async function createVarientAttributesApi(
  data: CreateAttributeVarientSchemaType
) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/varient-attribute/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Create varient attributes failed!");
  }

  return res.json();
}
export async function deleteVarientAttributesApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/varient-attribute/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete varient attributes!");
  }
  return res.json();
}
