import { baseApi } from "./baseApi";

export const callLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCallLog: builder.mutation({
      query: (body) => ({
        url: "/call-logs",
        method: "POST",
        contentType: "application/json",
        data: body,
      }),
      invalidatesTags: ["leads"],
    }),
  }),
});

export const { useCreateCallLogMutation } = callLogApi;
