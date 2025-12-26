import { ChangeOrderStatusSchemaType } from "@/validation/order.dto";
import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getCookie() {
  const cookieObj = (await cookies()).get(
    process.env.NEXT_PUBLIC_TOKEN_NAME || "nanubhai"
  );
  return cookieObj?.value;
}

export async function getAllOrdersApi(page?: number, limit?: number) {
  const token = await getCookie();
  const res = await fetch(
    `${BASE_URL}/api/order/all?page=${page || 1}&limit=${limit || 5}`,
    {
      cache: "no-store",
      next: { tags: ["Order"] },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to fetch orders!");
  }

  return res.json();
}

export async function changeOrderStatusApi(
  data: ChangeOrderStatusSchemaType,
  id: string
) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/order/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to change order status!");
  }

  return res.json();
}

export async function deleteOrderApi(id: string) {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/order/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to delete order!");
  }

  return res.json();
}

export async function getMonthlySalesApi() {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/order/monthly-sales`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to get monthly sales!");
  }

  return res.json();
}

export async function getProfitSummeryApi() {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/order/profit-summery`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to get profit summery!");
  }

  return res.json();
}

export async function getStockOverviewApi() {
  const token = await getCookie();
  const res = await fetch(`${BASE_URL}/api/order/stock-overview`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const result = await res.json().catch(() => ({}));
    throw new Error(result.message || "Failed to get stock overview!");
  }

  return res.json();
}
