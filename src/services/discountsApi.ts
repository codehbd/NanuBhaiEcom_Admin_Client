import {
  ActiveInactiveDiscountSchemaType,
  CreateDiscountSchemaType,
  CreateDiscountTierSchemaType,
} from "@/validation/discount.dto";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCookie() {
  const cookieObj = (await cookies()).get(
    process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai"
  );
  return cookieObj?.value;
}
export async function getSingleDiscountApi(id: string) {
  const token = await getCookie();

  const res = await fetch(`${BASE_URL}/api/discount/${id}`, {
    next: { tags: ["discount"] },
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch single discount!");
  }
  return res.json();
}
export async function getAllDiscountsApi(page?: number, limit?: number) {
  const res = await fetch(
    `${BASE_URL}/api/discount/all?page=${page || 1}&limit=${limit || 5}`,
    {
      next: { tags: ["discount"] },
    }
  );
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch discounts!");
  }

  return res.json();
}
export async function updateDiscountApi(
  data: CreateDiscountSchemaType,
  id: string
) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/discount/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Update discount failed!");
  }

  return res.json();
}
export async function createDiscountApi(data: CreateDiscountSchemaType) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/discount/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Create discount failed!");
  }

  return res.json();
}
export async function deleteDiscountApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/discount/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete discount!");
  }
  return res.json();
}
export async function activeInactiveDiscountApi(
  data: ActiveInactiveDiscountSchemaType,
  id: string
) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/discount/active-inactive/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to active/inactive discount!");
  }
  return res.json();
}
export async function getDiscountTiersApi() {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/discount/all-tier`, {
    next: { tags: ["discount-tier"] },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch discount tiers!");
  }

  return res.json();
}
export async function createDiscountTierApi(
  data: CreateDiscountTierSchemaType
) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/discount/create-tier`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Create discount tier failed!");
  }

  return res.json();
}
export async function deleteDiscountTierApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/discount/tier/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete discount tier!");
  }
  return res.json();
}
