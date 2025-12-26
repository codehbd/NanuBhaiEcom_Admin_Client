import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCookie() {
  const cookieObj = (await cookies()).get(
    process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai"
  );
  return cookieObj?.value;
}
export async function getSingleCategoryApi(id: string) {
  const res = await fetch(`${BASE_URL}/api/category/${id}`, {
    cache: "no-store",
    next: { tags: ["Category"] },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch category!");
  }
  return res.json();
}
export async function getFlatAllCategoriesApi() {
  const res = await fetch(`${BASE_URL}/api/category/flat-all`, {
    cache: "no-store",
    next: { tags: ["Category"] },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch categories!");
  }

  return res.json();
}
export async function updateCategoryApi(data: FormData, id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/category/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Update category failed!");
  }

  return res.json();
}
export async function createCategoryApi(data: FormData) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/category/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Create category failed!");
  }

  return res.json();
}
export async function deleteCategoryApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/category/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete category!");
  }
  return res.json();
}
