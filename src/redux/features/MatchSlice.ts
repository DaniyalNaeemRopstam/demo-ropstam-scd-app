import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import MatchService from "../api/MatchService";

export const createMatchAsynThunk = createAsyncThunk(
  "postCreateMatch",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await MatchService.createMatchApi(rest, token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error?.response?.data?.desc;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);

export const updateMatchAsynThunk = createAsyncThunk(
  "updateCreateMatch",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await MatchService.updateMatchApi(rest, token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error?.response?.data?.desc;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);

export const getMatchAsynThunk = createAsyncThunk(
  "postCreateMatch",
  async (token: string, thunkAPI) => {
    try {
      return await MatchService.getMatchApi(token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error?.response?.data?.desc;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);

export const useHarpoonAsynThunk = createAsyncThunk(
  "useHarpoon",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await MatchService.useHarpoonApi(rest, token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error?.response?.data?.desc;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);

export const useHarpoonCatchAsynThunk = createAsyncThunk(
  "useHarpoonCatch",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await MatchService.useHarpoonCatchApi(rest, token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error?.response?.data?.desc;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);

export const getCatchAsynThunk = createAsyncThunk(
  "getCatch",
  async (token: string, thunkAPI) => {
    try {
      return await MatchService.getCatchApi(token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error?.response?.data?.desc;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);
