import { createSlice } from "@reduxjs/toolkit";

export const addVoterSlice = createSlice({
  name: "addVoter",
  initialState: {
    voterRoute: "home",
  },
  reducers: {
    setAddVoterRoute: (state, action) => {
      state.voterRoute = action.payload;
    },
  },
});

export const { setAddVoterRoute } = addVoterSlice.actions;
export default addVoterSlice.reducer;
export const addVoterState = (state) => state.addVoter;
