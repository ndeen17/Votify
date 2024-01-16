import { createSlice } from "@reduxjs/toolkit";

export const ballotSlice = createSlice({
  name: "ballot",
  initialState: {
    ballotList: [],
    ballotData: {},
    ballotRoute: "home",
  },
  reducers: {
    setBallotList: (state, action) => {
      state.ballotList = action.payload;
    },
    setBallotData: (state, action) => {
      state.ballotData = action.payload;
    },
    setBallotRoute: (state, action) => {
      state.ballotRoute = action.payload;
    },
  },
});

export const { setBallotData, setBallotList, setBallotRoute } =
  ballotSlice.actions;
export const ballotState = (state) => state.ballot;
export default ballotSlice.reducer;

// ballotData === currentBallotData
