import { BASE_URL_FROM_ENV } from "@env";
import api from "./axiosConfig";

const API_GET_USER_BEACON = `${BASE_URL_FROM_ENV}/api/beacon`;
const API_USE_BEACON = `${BASE_URL_FROM_ENV}/api/beacon/use`;
const API_PURCHASE_BEACON = `${BASE_URL_FROM_ENV}/api/beacon/purchase`;
const API_DEACTIVATE_BEACON = `${BASE_URL_FROM_ENV}/api/beacon/end`;

const getUserBeaconsApi = async (token: string) => {
  const config = {
    method: "get",
    url: API_GET_USER_BEACON,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const useBeaconsApi = async (token: string) => {
  const config = {
    method: "post",
    url: API_USE_BEACON,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const purchaseBeaconsApi = async (data: any, token: string) => {
  const config = {
    method: "post",
    url: API_PURCHASE_BEACON,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const deactivateBeaconApi = async (token: string) => {
  const config = {
    method: "post",
    url: API_DEACTIVATE_BEACON,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const BeaconService = {
  getUserBeaconsApi,
  useBeaconsApi,
  purchaseBeaconsApi,
  deactivateBeaconApi,
};
export default BeaconService;
