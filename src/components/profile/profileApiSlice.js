import { apiSlice } from "../../app/api/apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUpload: builder.query({
      query: () => "/upload/get",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData;
      },
    }),
    getUser: builder.query({
      query: () => "/user/get",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData;
      },
    }),
    fetchUpload: builder.mutation({
      query: (query) => ({
        url: "/upload/get",
        method: "POST",
        body: {
          ...query,
        },
      }),
    }),
    deleteUpload: builder.mutation({
      query: (query) => ({
        url: "/user/delete",
        method: "POST",
        body: {
          ...query,
        },
      }),
    }),
  }),
});

export const {
  useGetUploadQuery,
  useGetUserQuery,
  useFetchUploadMutation,
  useDeleteUploadMutation,
} = profileApiSlice;
