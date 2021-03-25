import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import cats from "./catsSlice";

export default configureStore({
  reducer: {
    cats,
  },
  middleware: [...getDefaultMiddleware()],
});
