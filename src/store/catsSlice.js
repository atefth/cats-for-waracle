import { navigate } from "@reach/router";
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
    `${endpoint}/images?sub_id=${subId}&limit=${limit}`,
    config
  );

  return response.data;
});

export const getVotes = createAsyncThunk("cats/fetchVotes", async () => {
  const response = await axios.get(
    `${endpoint}/votes?sub_id=${subId}&limit=${limit}`,
    config
  );

  return response.data;
});

export const vote = createAsyncThunk("cats/vote", async (args) => {
  const { imageId, value } = args;
  const response = await axios.post(
    `${endpoint}/votes`,
    { image_id: imageId, value, sub_id: subId },
    config
  );

  return response.data;
});

export const favourite = createAsyncThunk("cats/favourite", async (args) => {
  const { imageId } = args;
  const response = await axios.post(
    `${endpoint}/favourites`,
    { image_id: imageId, sub_id: subId },
    config
  );

  return response.data;
});

export const unfavourite = createAsyncThunk(
  "cats/unfavourite",
  async (args) => {
    const { favouriteId } = args;
    const response = await axios.delete(
      `${endpoint}/favourites/${favouriteId}`,
      config
    );

    return response.data;
  }
);

export const uploadCat = createAsyncThunk(
  "cats/createCat",
  async ({ file }, { rejectWithValue }) => {
    const fd = new FormData();
    fd.append("file", file, file.name);
    fd.append("sub_id", subId);
    try {
      const response = await axios.post(`${endpoint}/images/upload`, fd, {
        ...config,
        headers: { ...config.headers, "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
    clearUploadError(state, action) {
      return { ...state, uploadError: undefined };
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
        cats: [...action.payload],
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
    [vote.pending]: (state, action) => {
      const { imageId } = action.meta.arg;
      return {
        ...state,
        cats: state.cats.map((cat) => {
          if (cat.id === imageId) {
            return { ...cat, votingInProgress: true };
          } else {
            return cat;
          }
        }),
      };
    },
    [vote.fulfilled]: (state, action) => {
      const { imageId, value } = action.meta.arg;
      return {
        ...state,
        cats: state.cats.map((cat) => {
          if (cat.id === imageId) {
            return {
              ...cat,
              votingInProgress: false,
              votes: value === 1 ? cat.votes + 1 : cat.votes - 1,
            };
          } else {
            return cat;
          }
        }),
      };
    },
    [favourite.pending]: (state, action) => {
      const { imageId } = action.meta.arg;
      return {
        ...state,
        cats: state.cats.map((cat) => {
          if (cat.id === imageId) {
            return { ...cat, favouriteInProgress: true };
          } else {
            return cat;
          }
        }),
      };
    },
    [favourite.fulfilled]: (state, action) => {
      const { imageId } = action.meta.arg;
      return {
        ...state,
        cats: state.cats.map((cat) => {
          if (cat.id === imageId) {
            return {
              ...cat,
              favouriteInProgress: false,
              favouriteId: action.payload.id,
            };
          } else {
            return cat;
          }
        }),
      };
    },
    [unfavourite.pending]: (state, action) => {
      const { imageId } = action.meta.arg;
      return {
        ...state,
        cats: state.cats.map((cat) => {
          if (cat.id === imageId) {
            return { ...cat, favouriteInProgress: true };
          } else {
            return cat;
          }
        }),
      };
    },
    [unfavourite.pending]: (state, action) => {
      const { favouriteId } = action.meta.arg;
      return {
        ...state,
        cats: state.cats.map((cat) => {
          if (cat.favouriteId === favouriteId) {
            return {
              ...cat,
              favouriteInProgress: false,
              favouriteId: undefined,
            };
          } else {
            return cat;
          }
        }),
      };
    },
    [uploadCat.pending]: (state, action) => {
      return { ...state, uploadingCat: true };
    },
    [uploadCat.fulfilled]: (state, action) => {
      navigate("/");
      return {
        ...state,
        uploadingCat: false,
        cats: [...state.cats, action.payload],
      };
    },
    [uploadCat.rejected]: (state, action) => {
      return {
        ...state,
        uploadingCat: false,
        uploadError: action.payload.message,
      };
    },
  },
});

export const { clearUploadError } = catsSlice.actions;

export default catsSlice.reducer;
