import { BASE_URL_FROM_ENV } from "@env";
import api from "./axiosConfig";

const API_GET_USERS = `${BASE_URL_FROM_ENV}/api/user/radius`;
const API_GET_USER_SWIPES = `${BASE_URL_FROM_ENV}/api/swipe`;

const getUsersApi = async (token: string) => {
  const config = {
    method: "get",
    url: API_GET_USERS,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const getUserSwipesApi = async (token: string) => {
  const config = {
    method: "get",
    url: API_GET_USER_SWIPES,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const GameService = {
  getUsersApi,
  getUserSwipesApi,
};
export default GameService;
