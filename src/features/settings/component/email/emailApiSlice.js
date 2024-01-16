import { apiSlice } from "../../../../app/api/apiSlice";

export const emailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTemplate: builder.query({
      query: () => "/email/template/get",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData;
      },
    }),
    postTemplate: builder.mutation({
      query: (propsData) => {
        return {
          url: "/email/template/post",
          method: "POST",
          body: {
            ...propsData,
          },
        };
      },
    }),
    updateTemplate: builder.mutation({
      query: (propsData) => {
        return {
          url: "/email/template/update",
          method: "PATCH",
          body: {
            ...propsData,
          },
        };
      },
    }),
    sendAllMail: builder.mutation({
      query: (propsData) => {
        return {
          url: "/email/send",
          method: "POST",
          body: {
            ...propsData,
          },
        };
      },
    }),
  }),
});

export const {
  useGetTemplateQuery,
  useUpdateTemplateMutation,
  usePostTemplateMutation,
  useSendAllMailMutation,
} = emailApiSlice;
