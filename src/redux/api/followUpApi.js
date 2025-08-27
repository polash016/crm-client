import { baseApi } from "./baseApi";

export const followUpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createFollowUp: builder.mutation({
      query: (body) => ({
        url: "/follow-ups/create",
        method: "POST",
        contentType: "application/json",
        data: body,
      }),
      invalidatesTags: ["leads"],
    }),
  }),
});

export const { useCreateFollowUpMutation } = followUpApi;
