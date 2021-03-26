import { configureStore } from "@reduxjs/toolkit";
import app from "./appSlice";
import cats from "./catsSlice";

export default configureStore({
  reducer: {
    app,
    cats,
  },
});
