import { createAsyncThunk } from "@reduxjs/toolkit";
import NotificationService from "../api/NotificationService";
import axios from "axios";

export const getNotificationsAsynThunk = createAsyncThunk(
  "getNotifications",
  async (notificationData: any, thunkAPI) => {
    try {
      return await NotificationService.getNotificationsApi(notificationData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error.response?.data?.description;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);

export const getCountOfNotificationsAsynThunk = createAsyncThunk(
  "getNotifications",
  async (notificationData: any, thunkAPI) => {
    try {
      return await NotificationService.getCountOfNotificationsApi(
        notificationData
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errResp = error.response?.data?.description;
        return thunkAPI.rejectWithValue(errResp);
        // Handle your error type safe here
      } else {
        // Handle the unknown
      }
    }
  }
);

export const readAllNotificationsAsynThunk = createAsyncThunk(
  "allNotifications",
  async (token: string, thunkAPI) => {
    try {
      return await NotificationService.readAllNotificationsApi(token);
    } catch (error: any) {
      // Handle network errors
      if (!error.response) {
        // Network error occurred
        return thunkAPI.rejectWithValue("Network error occurred");
      }
      // Handle other errors
      if (axios.isAxiosError(error)) {
        const errResp = error.response?.data?.description;
        return thunkAPI.rejectWithValue(errResp);
      } else {
        // Handle the unknown
        return thunkAPI.rejectWithValue("Unknown error occurred");
      }
    }
  }
);
