import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BaseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseURL,
  }),
  tagTypes: ["Auth", "Shipping", "Order"],
  endpoints: () => ({}),
});
