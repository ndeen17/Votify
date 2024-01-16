import { apiSlice } from "../../app/api/apiSlice";

export const voteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateVote: builder.mutation({
      query: (propsData) => ({
        url: "/ballot/vote/update",
        method: "PATCH",
        body: {
          ...propsData,
        },
      }),
    }),
    loginVote: builder.mutation({
      query: (propsData) => ({
        url: "vote/login",
        method: "POST",
        body: {
          ...propsData,
        },
      }),
    }),
    singleVoted: builder.mutation({
      query: (propsData) => ({
        url: "/voted/get/single",
        method: "POST",
        body: {
          ...propsData,
        },
      }),
    }),
    singleVoted2: builder.mutation({
      query: (propsData) => ({
        url: "/voted/get/single2",
        method: "POST",
        body: {
          ...propsData,
        },
      }),
    }),
    vote: builder.mutation({
      query: (propsData) => ({
        url: "/vote",
        method: "PATCH",
        body: {
          ...propsData,
        },
      }),
    }),
    voted: builder.mutation({
      query: (propsData) => ({
        url: "/voted/create",
        method: "POST",
        body: {
          ...propsData,
        },
      }),
    }),
  }),
});

export const {
  useUpdateVoteMutation,
  useLoginVoteMutation,
  useSingleVotedMutation,
  useVoteMutation,
  useVotedMutation,
  useSingleVoted2Mutation,
} = voteApiSlice;
