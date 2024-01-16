import { apiSlice } from "../../app/api/apiSlice";

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVoted: builder.query({
      query: () => "/voted/get",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData;
      },
    }),
  }),
});

export const { useGetVotedQuery } = analyticsApiSlice;
