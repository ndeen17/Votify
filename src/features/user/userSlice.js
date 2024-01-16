import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
  },
  reducers: {
    setUserState: (state, action) => {
      state.user = action.payload.user;
    },
  },
});
export const { setUserState } = authSlice.actions;
// export const userId = (state) => state.user.user._id;
export const userState = (state) => state.user;
export default authSlice.reducer;
