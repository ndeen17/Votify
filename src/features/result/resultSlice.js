import { createSlice } from "@reduxjs/toolkit";

export const resultSlice = createSlice({
  name: "results",
  initialState: {
    resultData: {},
  },
  reducers: {
    setResultData: (state, action) => {
      state.resultData = action.payload;
    },
  },
});

export const { setResultData } = resultSlice.actions;
export default resultSlice.reducer;
export const resultState = (state) => state.result;
