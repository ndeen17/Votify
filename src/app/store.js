import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/user/userSlice";
import electionReducer from "../features/election/electionSlice";
import stateReducer from "../stateSlice";
import ballotReducer from "../features/ballot/ballotSlice";
import addVoterReducer from "../features/addVoters/addVoterSlice";
import voteReducer from "../features/vote/voteSlice";
import resultsReducer from "../features/result/resultSlice";
import settingsReducer from "../features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    user: userReducer,
    election: electionReducer,
    ballot: ballotReducer,
    state: stateReducer,
    addVoter: addVoterReducer,
    vote: voteReducer,
    results: resultsReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});
