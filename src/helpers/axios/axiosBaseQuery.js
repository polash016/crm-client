import { axiosInstance } from "@/helpers/axios/axiosInstance";

const axiosBaseQuery = ({ baseUrl } = { baseUrl: "" }) => {
  return async ({ url, method, data, params, headers, contentType }) => {
    try {
      const result = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: {
          "Content-Type": contentType || "application/json",
        },
      });
      console.log(result);
      return {
        data: result,
      };
    } catch (axiosError) {
      const err = axiosError;
      console.log(err);
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
};

export { axiosBaseQuery };
