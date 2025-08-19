import { baseApi } from "./baseApi";

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllRoles: builder.query({
      query: (params) => ({
        url: "/roles",
        method: "GET",
        params: params,
      }),

      providesTags: (result = [], error, arg) => [
        "Role",
        ...(result.data
          ? result.data.map(({ id }) => ({ type: "Role", id }))
          : []),
      ],
    }),
    getRoleById: builder.query({
      query: (id) => `/roles/${id}`,
      query: (id) => ({
        url: `/roles/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Role", id }],
    }),
    createRole: builder.mutation({
      query: (body) => ({
        url: "/roles/create",
        method: "POST",
        contentType: "application/json",
        data: body,
      }),
      invalidatesTags: ["Role"],
    }),
    updateRole: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/roles/update/${id}`,
        method: "PATCH",
        contentType: "application/json",
        data: body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Role", id }],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/roles/soft/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Role", id }],
    }),
  }),
});

export const {
  useGetAllRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = rolesApi;
