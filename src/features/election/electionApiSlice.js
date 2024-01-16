import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

import { apiSlice } from "../../app/api/apiSlice";

const electionADapter = createEntityAdapter();

const initialState = electionADapter.getInitialState();

export const electionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getElections: builder.query({
      query: () => "/election",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const transFormedData = responseData.map((election) => {
          election.id = election._id;
          return election;
        });
        return electionADapter.setAll(initialState, transFormedData);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Election", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Election", id })),
          ];
        } else return [{ type: "Election", id: "LIST" }];
      },
    }),
    getSingleElection: builder.query({
      query: () => "/election/single/get",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        return responseData;
      },
    }),
    singleElection: builder.mutation({
      query: (propsData) => {
        return {
          url: "/election/single",
          method: "POST",
          body: {
            ...propsData,
          },
        };
      },
    }),
    addNewElection: builder.mutation({
      query: (propsData) => ({
        url: "/election/create",
        method: "POST",
        body: {
          ...propsData,
        },
      }),
      invalidatesTags: [{ type: "Election", id: "LIST" }],
    }),
    updateElection: builder.mutation({
      query: (propsData) => ({
        url: "/election/update",
        method: "PATCH",
        body: {
          ...propsData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Election", id: arg.id },
      ],
    }),
    deleteElection: builder.mutation({
      query: () => ({
        url: `/election/delete`,
        method: "DELETE",
        body: {},
      }),
    }),
    deleteAllElection: builder.mutation({
      query: () => ({
        url: `/election/deleteAll`,
        method: "DELETE",
        body: {},
      }),
    }),
    electUpdate: builder.mutation({
      query: (data) => ({
        url: `/elect/update`,
        method: "PATCH",
        body: {
          ...data,
        },
      }),
    }),
  }),
});

export const {
  useGetElectionsQuery,
  useAddNewElectionMutation,
  useUpdateElectionMutation,
  useDeleteElectionMutation,
  useSingleElectionMutation,
  useGetSingleElectionQuery,
  useDeleteAllElectionMutation,
  useUpdateVoterMutation,
  useElectUpdateMutation,
} = electionApiSlice;

// returns the query result object
export const selectElectionResult =
  electionApiSlice.endpoints.getElections.select();

// Creates memoized selector
const selectElectionData = createSelector(
  selectElectionResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllElections,
  selectById: selectElectionById,
  selectIds: selectElectionsIds,
  // Pass in a selector that returns the posts slice of state
} = electionADapter.getSelectors(
  (state) => selectElectionData(state) ?? initialState
);
