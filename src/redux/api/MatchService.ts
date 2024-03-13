import { BASE_URL_FROM_ENV } from "@env";
import api from "./axiosConfig";

const API_CREATE_MATCH = `${BASE_URL_FROM_ENV}/api/match`;
const API_UPDATE_MATCH = `${BASE_URL_FROM_ENV}/api/match/update`;
const API_USE_HARPOON = `${BASE_URL_FROM_ENV}/api/harpoon/use`;
const API_USE_HARPOON_CATCHOFTHEDAY = `${BASE_URL_FROM_ENV}/api/catch/use`;
const API_GET_ALL_MATCH = `${BASE_URL_FROM_ENV}/api/match/all`;
const API_GET_CATCH = `${BASE_URL_FROM_ENV}/api/catch`;

const createMatchApi = async (data: any, token: string) => {
  const config = {
    method: "post",
    url: API_CREATE_MATCH,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {
      secondUser: data?.id,
      status: data?.status,
    },
  };

  const response = await api(config);
  return response.data;
};

const updateMatchApi = async (data: any, token: string) => {
  const config = {
    method: "put",
    url: API_UPDATE_MATCH,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {
      matchID: data?.matchID,
      status: data?.status,
    },
  };

  const response = await api(config);
  return response.data;
};

const useHarpoonApi = async (data: any, token: string) => {
  const config = {
    method: "post",
    url: API_USE_HARPOON,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {
      harpoonUser: data?.id,
      userName: data?.userName,
    },
  };

  const response = await api(config);
  return response.data;
};

const useHarpoonCatchApi = async (data: any, token: string) => {
  const config = {
    method: "put",
    url: API_USE_HARPOON_CATCHOFTHEDAY,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const getMatchApi = async (token: string) => {
  const config = {
    method: "get",
    url: API_GET_ALL_MATCH,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const getCatchApi = async (token: string) => {
  const config = {
    method: "get",
    url: API_GET_CATCH,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const MatchService = {
  createMatchApi,
  getMatchApi,
  useHarpoonApi,
  getCatchApi,
  useHarpoonCatchApi,
  updateMatchApi,
};
export default MatchService;
