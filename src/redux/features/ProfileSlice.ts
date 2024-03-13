import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import ProfileService from "../api/ProfileService";

export const gmailLoginAsynThunk = createAsyncThunk(
  "gmail",
  async (gmailID: string, thunkAPI) => {
    try {
      return await ProfileService.getGmailLoginApi(gmailID);
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

export const facebookLoginAsynThunk = createAsyncThunk(
  "facebook",
  async (facebookID: string, thunkAPI) => {
    try {
      return await ProfileService.getFacebookLoginApi(facebookID);
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

export const appleLoginAsynThunk = createAsyncThunk(
  "apple",
  async (appleID: string, thunkAPI) => {
    try {
      return await ProfileService.getAppleLoginApi(appleID);
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

export const getProfileAsynThunk = createAsyncThunk(
  "profile",
  async (token: string, thunkAPI) => {
    try {
      return await ProfileService.getProfileApi(token);
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

export const checkUserNameAsyncThunk = createAsyncThunk(
  "userName",
  async (data: any, thunkAPI) => {
    try {
      return await ProfileService.checkUserNameApi(data);
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

export const createProfileAsynThunk = createAsyncThunk(
  "userProfile",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ProfileService.createProfileApi(rest, token);
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

export const updateSoundAsynThunk = createAsyncThunk(
  "updateSound",
  async (data: any, thunkAPI) => {
    try {
      return await ProfileService.updateSoundApi(data);
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

export const uploadImageAsynThunk = createAsyncThunk(
  "uploadImage",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ProfileService.uploadImageApi(rest, token);
    } catch (error) {
      // console.error("Error in uploadImageAsynThunk:", error); // Log the actual error

      if (axios.isAxiosError(error) && !error.response) {
        return thunkAPI.rejectWithValue(
          "Network error. Please check your connection."
        );
      } else if (axios.isAxiosError(error)) {
        const errResp = error.response?.data?.desc;
        return thunkAPI.rejectWithValue(errResp);
      } else {
        return thunkAPI.rejectWithValue("Unknown error occurred");
      }
    }
  }
);

export const deleteImageAsynThunk = createAsyncThunk(
  "deleteImage",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ProfileService.deleteImageApi(rest, token);
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

export const deleteAccountAsynThunk = createAsyncThunk(
  "deleteAccount",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ProfileService.deleteAccountApi(rest, token);
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

export const getUserProfileAsynThunk = createAsyncThunk(
  "userProfile",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ProfileService.getUserProfileApi(rest, token);
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

export const unmatchUserAsynThunk = createAsyncThunk(
  "unmatchUser",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ProfileService.unmatchUserApi(rest, token);
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

export const premiumUserAsynThunk = createAsyncThunk(
  "premiumUser",
  async (data: any, thunkAPI) => {
    try {
      const { token, ...rest } = data;
      return await ProfileService.premiumUserApi(rest, token);
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
