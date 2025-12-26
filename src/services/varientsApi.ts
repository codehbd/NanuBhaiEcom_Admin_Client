import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCookie() {
  const cookieObj = (await cookies()).get(
    process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai"
  );
  return cookieObj?.value;
}
export async function getSingleVarientApi(id: string) {
  const token = await getCookie();

  const res = await fetch(`${BASE_URL}/api/varient/${id}`, {
    next: { tags: ["Varient"] },
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch varient!");
  }
  return res.json();
}
export async function getAllVarientsApi(page?: number, limit?: number) {
  const token = await getCookie();

  const res = await fetch(
    `${BASE_URL}/api/varient/all?page=${page || 1}&limit=${limit || 5}`,
    {
      next: { tags: ["Varient"] },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch varients!");
  }

  return res.json();
}
export async function updateVarientApi(data: FormData, id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/varient/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Update varient failed!");
  }

  return res.json();
}
export async function createVarientApi(data: FormData) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/varient/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Create varient failed!");
  }

  return res.json();
}
export async function deleteVarientApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/varient/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete varient!");
  }
  return res.json();
}
