import { baseApi } from "./baseApi";

const uploadImageApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadImage: build.mutation({
      query: (data) => ({
        url: "/upload-image",
        method: "POST",
        contentType: "multipart/form-data",
        data,
      }),
      invalidatesTags: ["category"],
    }),
  }),

  overrideExisting: true,
});

export const { useUploadImageMutation } = uploadImageApi;
