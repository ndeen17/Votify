import { createSlice } from "@reduxjs/toolkit";

export const voteSlice = createSlice({
  name: "vote",
  initialState: {
    electionData: {},
    voteRoute: "Vote",
    voterData: {},
    votedFor: {},
    electionExist: false,
    canVote: false,
  },
  reducers: {
    setElectionData: (state, action) => {
      state.electionData = action.payload;
    },
    setVoteRoute: (state, action) => {
      state.voteRoute = action.payload;
    },
    setVoterData: (state, action) => {
      state.voterData = action.payload;
    },
    setVotedFor: (state, action) => {
      state.votedFor = action.payload;
    },
    setElectionExist: (state, action) => {
      state.electionExist = action.payload;
    },
    setCanVote: (state, action) => {
      state.canVote = action.payload;
    },
  },
});

export const {
  setVoteRoute,
  setVoterData,
  setVotedFor,
  setElectionExist,
  setCanVote,
  setElectionData,
} = voteSlice.actions;
export default voteSlice.reducer;
export const voteState = (state) => state.vote;
