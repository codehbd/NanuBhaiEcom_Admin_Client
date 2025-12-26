import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCookie() {
  const cookieObj = (await cookies()).get(
    process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai"
  );
  return cookieObj?.value;
}

export async function getAllProductsApi(page?: number, limit?: number,category ?:string) {
  const token = await getCookie();
  const res = await fetch(
    `${BASE_URL}/api/product/all?page=${page || 1}&limit=${limit || 5}&category=${category || ""}`,
    {
      cache: "no-store",
      next: { tags: ["Product"] },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch products!");
  }

  return res.json();
}

export async function getSingleProductApi(id?: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/product/${id}`, {
    cache: "no-store",
    next: { tags: ["Product"] },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch product!");
  }

  return res.json();
}

export async function createProductApi(data: FormData) {
  const token = await getCookie();

  const res = await fetch(`${BASE_URL}/api/product/create`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Create product failed!");
  }
  return res.json();
}

export async function updateProductApi(data: FormData, id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/product/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Update product failed");
  }

  return res.json();
}

export async function deleteProductApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/product/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Product delete failed");
  }
  return res.json();
}

export async function deleteProductImageApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/product-image/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Profile update failed");
  }
  return res.json();
}
