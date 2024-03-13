import { BASE_URL_FROM_ENV } from "@env";
import { Platform } from "react-native";
import api from "./axiosConfig";

const API_GET_ALL_CHATS = `${BASE_URL_FROM_ENV}/api/chats/all`;
const API_GET_TOTAL_COUNT = `${BASE_URL_FROM_ENV}/api/match/count`;
const API_GET_CHAT = `${BASE_URL_FROM_ENV}/api/message`;
const API_UPLOAD_AUDIO = `${BASE_URL_FROM_ENV}/api/media/upload`;
const API_DELETE_CHAT = `${BASE_URL_FROM_ENV}/api/chats/delete/`;

const getAllChatsAPi = async (token: string) => {
  const config = {
    method: "get",
    url: API_GET_ALL_CHATS,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const getChatAPi = async (data: any, token: string) => {
  const config = {
    method: "post",
    url: API_GET_CHAT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const uploadAudioMessageApi = async (data: any, token: string) => {
  const audioData = new FormData();
  audioData.append("files", {
    uri:
      Platform.OS === "android"
        ? data?.audio
        : data?.audio?.replace("file://", ""),
    name: Platform.OS == "android" ? "audio.mp3" : "audio.m4a",
    type: Platform.OS == "android" ? "audio/mp3" : "audio/m4a",
  });

  const config = {
    method: "post",
    url: API_UPLOAD_AUDIO,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    data: audioData,
  };

  const response = await api(config);
  return response.data;
};

const getTotalCountApi = async (token: string) => {
  const config = {
    method: "get",
    url: API_GET_TOTAL_COUNT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const deleteChatApi = async (data: any, token: string) => {
  const config = {
    method: "get",
    url: API_DELETE_CHAT + data?.id,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const ChatService = {
  getAllChatsAPi,
  getChatAPi,
  uploadAudioMessageApi,
  getTotalCountApi,
  deleteChatApi,
};

export default ChatService;
