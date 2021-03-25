import { configureStore } from "@reduxjs/toolkit";
import cats from "./catsSlice";

export default configureStore({
  reducer: {
    cats,
  },
});
