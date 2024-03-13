import { BASE_URL_FROM_ENV } from "@env";
import { Platform } from "react-native";
import { store } from "../app/store";
import api from "./axiosConfig";

const API_GET_USER = `${BASE_URL_FROM_ENV}/api/user`;
const API_GET_USER_PROFILE = `${BASE_URL_FROM_ENV}/api/user/info/`;
const API_UNMATCH_USER = `${BASE_URL_FROM_ENV}/api/match/remove/`;
const API_CHECK_USER_NAME = `${BASE_URL_FROM_ENV}/api/user/check/username`;
const API_CREATE_PROFILE = `${BASE_URL_FROM_ENV}/api/user/profile/create`;
const API_UPDATE_SOUND = `${BASE_URL_FROM_ENV}/api/user/sound`;
const API_GMAIL_LOGIN = `${BASE_URL_FROM_ENV}/api/user/login/gmail`;
const API_FACEBOOK_LOGIN = `${BASE_URL_FROM_ENV}/api/user/login/facebook`;
const API_APPLE_LOGIN = `${BASE_URL_FROM_ENV}/api/user/login/apple`;
const API_MEDIA_UPLOAD = `${BASE_URL_FROM_ENV}/api/media/upload`;
const API_MEDIA_DELETE = `${BASE_URL_FROM_ENV}/api/media/delete`;
const API_DELETE_ACCOUNT = `${BASE_URL_FROM_ENV}/api/user/delete`;
const API_PREMIUM_USER = `${BASE_URL_FROM_ENV}/api/user/premium`;

const getGmailLoginApi = async (gmailID: string) => {
  const data = {
    gmailID: gmailID,
  };

  const config = {
    method: "post",
    url: API_GMAIL_LOGIN,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await api(config);
  return response.data;
};

const getFacebookLoginApi = async (facebookID: string) => {
  const data = {
    facebookID: facebookID,
  };
  const config = {
    method: "post",
    url: API_FACEBOOK_LOGIN,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await api(config);
  return response.data;
};

const getAppleLoginApi = async (appleID: string) => {
  const data = {
    appleID: appleID,
  };

  const config = {
    method: "post",
    url: API_APPLE_LOGIN,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await api(config);
  return response.data;
};

const getProfileApi = async (token: string) => {
  const state = store.getState();
  const mobileToken = state.login.mobileToken;
  const config = {
    method: "put",
    url: API_GET_USER,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: { mobileToken },
  };

  const response = await api(config);
  return response.data;
};

const checkUserNameApi = async (userData: any) => {
  const data = {
    userName: userData?.userName,
  };
  const config = {
    method: "post",
    url: API_CHECK_USER_NAME,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userData?.token}`,
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const createProfileApi = async (userData: any, token: string) => {
  const config = {
    method: "put",
    url: API_CREATE_PROFILE,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  };
  const response = await api(config);
  return response.data;
};

const updateSoundApi = async (data: any) => {
  const soundData = {
    isSound: data?.isSound,
  };
  const config = {
    method: "put",
    url: API_UPDATE_SOUND,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data?.token}`,
    },
    data: soundData,
  };

  const response = await api(config);
  return response.data;
};

const uploadImageApi = async (data: any, token: string) => {
  const formData = new FormData();
  formData.append("files", {
    uri: data?.image?.path,
    type: data?.image?.mime, // Modify based on the image type
    name:
      Platform.OS == "android"
        ? data?.image?.path.split("/").slice(-1)[0]
        : data?.image?.filename, // Modify the name as needed
  });
  const config = {
    method: "post",
    url: API_MEDIA_UPLOAD,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  const response = await api(config);
  return response.data;
};

const deleteImageApi = async (data: any, token: string) => {
  const config = {
    method: "post",
    url: API_MEDIA_DELETE,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const deleteAccountApi = async (data: any, token: string) => {
  const config = {
    method: "put",
    url: API_DELETE_ACCOUNT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const getUserProfileApi = async (data: any, token: string) => {
  const config = {
    method: "get",
    url: API_GET_USER_PROFILE + data?.id,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const unmatchUserApi = async (data: any, userToken: string) => {
  const config = {
    method: "put",
    url: API_UNMATCH_USER + data?.id,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
  };
  const response = await api(config);
  return response.data;
};

const premiumUserApi = async (data: any, token: string) => {
  const config = {
    method: "put",
    url: API_PREMIUM_USER,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  const response = await api(config);
  return response.data;
};

const ProfileService = {
  getProfileApi,
  checkUserNameApi,
  createProfileApi,
  updateSoundApi,
  getGmailLoginApi,
  getAppleLoginApi,
  uploadImageApi,
  deleteImageApi,
  getFacebookLoginApi,
  deleteAccountApi,
  getUserProfileApi,
  unmatchUserApi,
  premiumUserApi,
};
export default ProfileService;
