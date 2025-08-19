import { baseApi } from "./baseApi";

const permissionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPermissions: build.query({
      query: (params) => ({
        url: "/permissions",
        method: "GET",
        params: params,
      }),
    }),
  }),

  overrideExisting: true,
});

export const { useGetAllPermissionsQuery } = permissionApi;
