import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {},
  reducers: {},
});

// export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
