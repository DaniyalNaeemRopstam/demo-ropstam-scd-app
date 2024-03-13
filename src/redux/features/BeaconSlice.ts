import { createAsyncThunk } from "@reduxjs/toolkit";
import BeaconService from "../api/BeaconService";
import axios from "axios";

export const getUserBeaconsAsynThunk = createAsyncThunk(
  "getUserBeacon",
  async (token: string, thunkAPI) => {
    try {
      return await BeaconService.getUserBeaconsApi(token);
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

export const useBeaconsAsynThunk = createAsyncThunk(
  "useBeacon",
  async (token: string, thunkAPI) => {
    try {
      return await BeaconService.useBeaconsApi(token);
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

export const purchaseBeaconsAsynThunk = createAsyncThunk(
  "purchaseBeacon",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await BeaconService.purchaseBeaconsApi(rest, token);
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

export const deactivateBeaconsAsynThunk = createAsyncThunk(
  "deactivateBeacon",
  async (token: string, thunkAPI) => {
    try {
      return await BeaconService.deactivateBeaconApi(token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error.response.data;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);
