import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params: params,
      }),
      providesTags: (result = [], error, arg) => [
        "User",
        ...(result.data
          ? result.data.map(({ id }) => ({ type: "User", id }))
          : []),
      ],
    }),
    getUserById: builder.query({
      query: (id) => {
        console.log(id);
        return {
          url: `/users/${id.id}`,
          method: "GET",
        };
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getMyProfile: builder.query({
      query: () => {
        return {
          url: `/users/my`,
          method: "GET",
        };
      },
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: "/users/create-employee",
        method: "POST",
        contentType: "multipart/form-data",
        data: body,
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ data }) => {
        console.log(data);
        return {
          url: `/users/my-profile`,
          method: "PATCH",
          contentType: "multipart/form-data",
          data: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/delete-employee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetMyProfileQuery,
} = userApi;
