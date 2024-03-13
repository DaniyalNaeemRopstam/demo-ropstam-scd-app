import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import GameService from "../api/GameService";

export const getUsersAsynThunk = createAsyncThunk(
  "getUsers",
  async (token: string, thunkAPI) => {
    try {
      return await GameService.getUsersApi(token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error.response?.data?.desc;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);

export const getUserSwipesAsynThunk = createAsyncThunk(
  "getUserSwipes",
  async (token: string, thunkAPI) => {
    try {
      return await GameService.getUserSwipesApi(token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error.response?.data?.desc;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);
