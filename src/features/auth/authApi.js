import { apiSlice } from "../../app/api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (credential) => {
        return {
          url: "auth/register",
          method: "POST",
          body: credential,
        };
      },
    }),
    login: builder.mutation({
      query: (credential) => {
        return {
          url: "auth/login",
          method: "POST",
          body: credential,
        };
      },
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          // dispatch(logOut())
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

export const { useLoginMutation, useRegisterMutation, useSendLogoutMutation } =
  authApi;
