import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const endpoint = "https://api.thecatapi.com/v1";
const subId = "User-18-08-1991";
const config = {
  headers: {
    "x-api-key": process.env.REACT_APP_CATS_API_KEY,
  },
};
const limit = 20;

export const getCats = createAsyncThunk("cats/fetchCats", async () => {
  const response = await axios.get(
    `${endpoint}/images/search?limit=${limit}`,
    // `${endpoint}/images/search?sub_id=${subId}&limit=${limit}`,
    config
  );
  const data = await response.data;

  return data;
});

export const getVotes = createAsyncThunk("cats/fetchVotes", async () => {
  const response = await axios.get(
    `${endpoint}/votes?limit=${limit}`,
    // `${endpoint}/votes?sub_id=${subId}&limit=${limit}`,
    config
  );
  const data = await response.data;

  return data;
});

export const uploadCat = createAsyncThunk("cats/createCat", async (file) => {
  const response = await axios.post(
    `${endpoint}/images/upload`,
    { file, sub_id: subId },
    config
  );
  const data = await response.data;

  return data;
});

const catsSlice = createSlice({
  name: "cats",
  initialState: {
    loadingCats: false,
    loadedCats: false,
    loadingVotes: false,
    loadedVotes: false,
    cats: [],
  },
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
    [getCats.pending]: (state, action) => {
      return { ...state, loadingCats: true };
    },
    [getCats.fulfilled]: (state, action) => {
      return {
        ...state,
        loadingCats: false,
        loadedCats: true,
        cats: [...state.cats, ...action.payload],
      };
    },
    [getVotes.pending]: (state, action) => {
      return { ...state, loadingVotes: true };
    },
    [getVotes.fulfilled]: (state, action) => {
      return {
        ...state,
        loadingVotes: false,
        loadedVotes: true,
        cats: state.cats.map((cat) => {
          const vote = action.payload.find(
            ({ image_id }) => image_id === cat.id
          );
          if (vote) {
            return { ...cat, votes: vote.value };
          } else {
            return { ...cat, votes: 0 };
          }
        }),
      };
    },
    [uploadCat.fulfilled]: (state, action) => {
      return { ...state, cats: [...state.cats, action.payload] };
    },
  },
});

export const { toggleFavourite } = catsSlice.actions;

export default catsSlice.reducer;
