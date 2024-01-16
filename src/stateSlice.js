import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "state",
  initialState: {
    isMobile: false,
    currentOption: "",
    optionImgId: "",
    voterId: "",
    imgUrl: { path: null },
  },
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    setCurrentOption: (state, action) => {
      state.currentOption = action.payload;
    },
    setOptionImgId: (state, action) => {
      state.optionImgId = action.payload;
    },
    setVoterId: (state, action) => {
      state.voterId = action.payload;
    },
    setImgUrl: (state, action) => {
      state.imgUrl = action.payload;
    },
  },
});

export const {
  setCurrentOption,
  setImgUrl,
  setVoterId,
  setIsMobile,
  setOptionImgId,
} = authSlice.actions;
export const stateData = (state) => state.state;
export default authSlice.reducer;
