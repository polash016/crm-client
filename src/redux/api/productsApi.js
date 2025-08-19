import { baseApi } from "./baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createProduct: build.mutation({
      query: (data) => ({
        url: "/products/create-product",
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: ["products"],
    }),
    getAllProducts: build.query({
      query: (params) => ({
        url: "/products",
        method: "GET",
        params: params,
      }),
      providesTags: ["products"],
    }),

    getSingleProduct: build.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["products"],
    }),

    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/products/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),

    updateProduct: build.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: ["products"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useGetSingleProductQuery,
  useUpdateProductMutation,
} = productApi;
