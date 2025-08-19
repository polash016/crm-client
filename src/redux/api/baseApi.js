import { axiosBaseQuery } from "@/helpers/axios/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";
//
// http://localhost:3000

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SHEBA_API_URL || "http://localhost:5000",
    // prepareHeaders: (headers, { getState }) => {
    //   const state = getState();
    //   const accessToken = state?.auth?.accessToken;

    //   if (accessToken) {
    //     headers.set("Authorization", `Bearer ${accessToken}`);
    //   }

    //   return headers;
    // }
  }),
  endpoints: (builder) => ({}),
  tagTypes: [
    "products",
    "category",
    "orders",
    "User",
    "brands",
    "subCategory",
    "tenants",
    "deliveryRates",
    "paymentMethod",
    "comboPacks",
    "Role",
    "leads",
    "order",
  ],
});

export const {} = baseApi;
