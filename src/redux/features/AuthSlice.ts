import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { removeToken, setToken } from "../../helpers/AuthToken";
import AuthService from "../api/AuthService";
import axios from "axios";

export interface LoginState {
  token: string;
  isLoggedIn: boolean;
  userID: string;
  userName: string;
  counter: number;
  notification: boolean;
  phone: string;
  location: any;
  images: any;
  email: any;
  otp: string;
  password: string;
  confirmPassword: string;
  isProfileComplete: boolean;
  isSound: boolean;
  isViewMessageLog: boolean;
  themeMode: string;
  audio: string;
  isPremium: boolean;
  mainImage: string;
  mobileToken: string;
  gameUsers: any;
  beaconTime: any;
  totalMatches: number;
  chatID: string;
  flipped: boolean;
  cardsArray: any;
}

const initialState: LoginState = {
  userName: "",
  token: "",
  isLoggedIn: false,
  userID: "",
  counter: 0,
  notification: true,
  phone: "",
  location: {
    longitude: -122.431297,
    latitude: 37.773972,
  },
  images: [],
  email: "",
  otp: "",
  password: "",
  confirmPassword: "",
  isProfileComplete: false,
  isSound: false,
  isViewMessageLog: false,
  themeMode: "",
  audio: "",
  isPremium: false,
  mainImage: "",
  mobileToken: "",
  gameUsers: [],
  beaconTime: "",
  totalMatches: 0,
  chatID: "",
  flipped: true,
  cardsArray: [],
};

const loginSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    saveUser: (state, action) => {
      state.token = action.payload?.token;
      state.userID = action.payload?.userID;
      state.userName = action.payload?.userName;
      state.phone = action.payload?.phone;
      state.location = action.payload?.location;
      state.isLoggedIn = action.payload?.isLoggedIn;
      state.images = action.payload?.images;
      state.email = action.payload?.email;
      state.otp = action.payload?.otp;
      state.password = action.payload?.password;
      state.confirmPassword = action.payload?.confirmPassword;
      state.isProfileComplete = action.payload?.isProfileComplete;
    },
    deleteToken: (state) => {
      setToken("");
      removeToken();
      Object.assign(state, initialState);
    },
    setCounter: (state, action) => {
      state.counter = action.payload;
    },
    setNotifiction: (state, action) => {
      state.notification = action.payload;
    },
    setIsSound: (state, action) => {
      state.isSound = action.payload;
    },
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setAudio: (state, action) => {
      state.audio = action.payload;
    },
    setViewMessageLog: (state, action) => {
      state.isViewMessageLog = action.payload;
    },
    setPremium: (state, action) => {
      state.isPremium = action.payload;
    },
    setMainImage: (state, action) => {
      state.mainImage = action.payload;
    },
    setMobileToken: (state, action) => {
      state.mobileToken = action.payload;
    },
    setGameUsers: (state, action) => {
      state.gameUsers = action.payload;
    },
    setCardsArray: (state, action) => {
      state.cardsArray = action.payload;
    },
    setBeaconTime: (state, action) => {
      state.beaconTime = action.payload;
    },
    setTotalMatches: (state, action) => {
      state.totalMatches = action.payload;
    },
    setChatID: (state, action) => {
      state.chatID = action.payload;
    },
    setFlipped: (state, action) => {
      state.flipped = action.payload;
    },
  },
});

export const userLoginThunk = createAsyncThunk(
  "Login",
  async (loginData: any, thunkAPI) => {
    try {
      return await AuthService.loginUserApi(loginData);
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

export const loginOTPThunk = createAsyncThunk(
  "loginOtp",
  async (loginData: any, thunkAPI) => {
    try {
      return await AuthService.loginOtpApi(loginData);
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

export const verifyOtpAsyncThunk = createAsyncThunk(
  "verifyOtp",
  async (OtpData: any, thunkAPI) => {
    try {
      return await AuthService.verifyOtpApi(OtpData);
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

export const signUpEmailAyncThunk = createAsyncThunk(
  "emailSignup",
  async (data: any, thunkAPI) => {
    try {
      const resp = await AuthService.signUpEmailApi(data);
      return resp;
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

export const signUpNumberAyncThunk = createAsyncThunk(
  "numberSignup",
  async (data: any, thunkAPI) => {
    try {
      return await AuthService.signUpNumberApi(data);
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

export const createPasswordAsyncThunk = createAsyncThunk(
  "createPassword",
  async (profileData: any, thunkAPI) => {
    try {
      return await AuthService.createPasswordAPi(profileData);
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

export const forgetPasswordAsyncThunk = createAsyncThunk(
  "forgotPassword",
  async (forgetData: any, thunkAPI) => {
    try {
      return await AuthService.forgetPasswordApi(forgetData);
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

export const {
  saveUser,
  deleteToken,
  setCounter,
  setNotifiction,
  setIsSound,
  setThemeMode,
  setAudio,
  setViewMessageLog,
  setPremium,
  setMainImage,
  setMobileToken,
  setGameUsers,
  setBeaconTime,
  setTotalMatches,
  setChatID,
  setFlipped,
  setCardsArray,
} = loginSlice.actions;
export default loginSlice.reducer;
