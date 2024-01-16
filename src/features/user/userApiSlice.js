import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => "/user/get",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData;
      },
    }),
    updateUser: builder.mutation({
      query: (propsData) => {
        return {
          url: "/user/update",
          method: "PATCH",
          body: {
            ...propsData,
          },
        };
      },
    }),
    deleteUser: builder.mutation({
      query: (propsData) => {
        return {
          url: "/user/delete",
          method: "delete",
          body: {
            ...propsData,
          },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const { useGetUserQuery, useDeleteUserMutation, useUpdateUserMutation } =
  userApiSlice;
