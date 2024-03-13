import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import ChatService from "../api/ChatService";

export const getAllChatsAsynThunk = createAsyncThunk(
  "getAllChats",
  async (token: any, thunkAPI) => {
    try {
      return await ChatService.getAllChatsAPi(token);
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

export const getChatAsynThunk = createAsyncThunk(
  "chatMessages",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ChatService.getChatAPi(rest, token);
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

export const uploadAudioAsynThunk = createAsyncThunk(
  "audioMessages",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ChatService.uploadAudioMessageApi(rest, token);
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

export const getTotalCounterAsyncThunk = createAsyncThunk(
  "totalCounter",
  async (token: string, thunkAPI) => {
    try {
      return await ChatService.getTotalCountApi(token);
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

export const deleteChatAsyncThunk = createAsyncThunk(
  "deleteChat",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ChatService.deleteChatApi(rest, token);
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
