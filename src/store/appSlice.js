import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "cats",
  initialState: {
    drawerState: false,
  },
  reducers: {
    openDrawer(state, action) {
      return { ...state, drawerState: true };
    },
    closeDrawer(state, action) {
      return { ...state, drawerState: false };
    },
  },
});

export const { openDrawer, closeDrawer } = appSlice.actions;

export default appSlice.reducer;
