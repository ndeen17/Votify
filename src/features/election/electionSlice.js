import { createSlice } from "@reduxjs/toolkit";

export const electionSlice = createSlice({
  name: "election",
  initialState: {
    electionData: {},
    electionRoute: "overview",
  },
  reducers: {
    setElectionData: (state, action) => {
      state.electionData = action.payload;
    },
    setElectionRoute: (state, action) => {
      state.electionRoute = action.payload;
    },
  },
});

export const { setElectionData, setElectionRoute } = electionSlice.actions;
export default electionSlice.reducer;
export const electionState = (state) => state.election;
