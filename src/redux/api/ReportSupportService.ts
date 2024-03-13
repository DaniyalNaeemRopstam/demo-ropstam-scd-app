import { BASE_URL_FROM_ENV } from "@env";
import api from "./axiosConfig";

const API_REPORT = `${BASE_URL_FROM_ENV}/api/report`;
const API_SUPPORT = `${BASE_URL_FROM_ENV}/api/support`;

const createReportApi = async (data: any, token: string) => {
  const config = {
    method: "post",
    url: API_REPORT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const getReportApi = async (token: string) => {
  const config = {
    method: "post",
    url: API_REPORT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const createSupportApi = async (data: any, token: string) => {
  const config = {
    method: "post",
    url: API_SUPPORT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const getSupportApi = async (token: string) => {
  const config = {
    method: "get",
    url: API_SUPPORT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const ReportSupportService = {
  createReportApi,
  getReportApi,
  createSupportApi,
  getSupportApi,
};
export default ReportSupportService;
