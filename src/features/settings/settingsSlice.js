import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    settingsRoute: "General",
  },
  reducers: {
    setSettingsRoute: (state, action) => {
      state.settingsRoute = action.payload;
    },
  },
});

export const { setSettingsRoute } = settingsSlice.actions;
export default settingsSlice.reducer;
export const settingsState = (state) => state.settings;
