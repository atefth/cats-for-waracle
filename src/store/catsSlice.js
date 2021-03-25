import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const endpoint = "https://api.thecatapi.com/v1";
const subId = "User-18-08-1991";
const config = { headers: { "x-api-key": process.env.REACT_APP_CATS_API_KEY } };

export const getCats = createAsyncThunk("cats", async () => {
  const response = await axios.get(`${endpoint}/images`, config);
  const data = await response.data;

  return data;
});

export const uploadCat = createAsyncThunk("newCat", async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("sub_id", subId);

  const response = await axios.post(`${endpoint}/upload`, formData, config);
  const data = await response.data;

  return data;
});

const catsSlice = createSlice({
  name: "cats",
  initialState: [],
  reducers: {
    toggleFavourite: {
      reducer: (state, action) => {
        state = state.map((cat) => {
          if (cat.id === action.payload.id) {
            return { ...cat, favourite: !cat.favourite };
          } else {
            return cat;
          }
        });
      },
    },
  },
  extraReducers: {
    [getCats.fulfilled]: (state, action) => {
      state.push(action.payload);
    },
    [uploadCat.fulfilled]: (state, action) => {
      state.push(action.payload);
    },
  },
});

export const { toggleFavourite } = catsSlice.actions;

export default catsSlice.reducer;
