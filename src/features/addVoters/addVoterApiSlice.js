import { apiSlice } from "../../app/api/apiSlice";

export const AddVoterApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateVoter: builder.mutation({
      query: (propsData) => ({
        url: "/election/voter/update",
        method: "PATCH",
        body: {
          ...propsData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Election", id: arg.id },
      ],
    }),
  }),
});

export const { useUpdateVoterMutation } = AddVoterApiSlice;
