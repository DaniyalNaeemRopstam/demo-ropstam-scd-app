import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import ReportSupportService from "../api/ReportSupportService";

export const createReportAsynThunk = createAsyncThunk(
  "createReport",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ReportSupportService.createReportApi(rest, token);
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

export const getReportAsynThunk = createAsyncThunk(
  "getReport",
  async (token: string, thunkAPI) => {
    try {
      return await ReportSupportService.getReportApi(token);
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

export const createSupportAsynThunk = createAsyncThunk(
  "createSupport",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ReportSupportService.createSupportApi(rest, token);
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

export const getSupportAsynThunk = createAsyncThunk(
  "getSupport",
  async (token: string, thunkAPI) => {
    try {
      return await ReportSupportService.getSupportApi(token);
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
