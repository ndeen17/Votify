import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const ballotADapter = createEntityAdapter();

const initialState = ballotADapter.getInitialState();

export const ballotApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBallots: builder.query({
      query: () => "/ballot",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const transFormedData = responseData.map((ballot) => {
          ballot.id = ballot._id;
          return ballot;
        });
        return ballotADapter.setAll(initialState, transFormedData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Ballot", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Ballot", id })),
          ];
        } else return [{ type: "Ballot", id: "LIST" }];
      },
    }),

    singleBallot: builder.mutation({
      query: (propsData) => {
        return {
          url: "/ballot/single",
          method: "POST",
          body: {
            ...propsData,
          },
        };
      },
    }),
    addNewBallot: builder.mutation({
      query: (propsData) => ({
        url: "/ballot/create",
        method: "POST",
        body: {
          ...propsData,
        },
      }),
      invalidatesTags: [{ type: "Ballot", id: "LIST" }],
    }),
    updateBallot: builder.mutation({
      query: (propsData) => ({
        url: "/ballot/update",
        method: "PATCH",
        body: {
          ...propsData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Ballot", id: arg.id }],
    }),
    deleteBallot: builder.mutation({
      query: (propsData) => ({
        url: `/ballot/delete`,
        method: "DELETE",
        body: { ...propsData },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Ballot", id: arg.id }],
    }),
    updateBallotOptions: builder.mutation({
      query: (propsData) => ({
        url: "/ballot/options/update",
        method: "PATCH",
        body: {
          ...propsData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Ballot", id: arg.id }],
    }),
    addBallotOptions: builder.mutation({
      query: (propsData) => ({
        url: "/ballot/options/add",
        method: "POST",
        body: {
          ...propsData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Ballot", id: arg.id }],
    }),
    delBallotOptions: builder.mutation({
      query: (propsData) => ({
        url: "/ballot/options/delete",
        method: "PATCH",
        body: {
          ...propsData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Ballot", id: arg.id }],
    }),
  }),
});

export const {
  useGetBallotsQuery,
  useAddNewBallotMutation,
  useUpdateBallotMutation,
  useDeleteBallotMutation,
  useSingleBallotMutation,
  useUpdateBallotOptionsMutation,
  useAddBallotOptionsMutation,
  useDelBallotOptionsMutation,
} = ballotApiSlice;

// returns the query result object
export const selectBallotResult = ballotApiSlice.endpoints.getBallots.select();

// Creates memoized selector
const selectBallotData = createSelector(
  selectBallotResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllBallots,
  selectById: selectBallotById,
  selectIds: selectBallotsIds,
  // Pass in a selector that returns the posts slice of state
} = ballotADapter.getSelectors(
  (state) => selectBallotData(state) ?? initialState
);
