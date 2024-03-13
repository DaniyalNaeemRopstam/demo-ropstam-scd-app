import { BASE_URL_FROM_ENV } from "@env";
import api from "./axiosConfig";

const API_GET_NOTIFICATION = `${BASE_URL_FROM_ENV}/api/v1/users/notifications`;
const API_COUNT_OF_NOTIFICATIONS = `${BASE_URL_FROM_ENV}/api/v1/users/count-of-unseen-notificationsmark-all-notifications-as-seen`;
const API_READ_ALL_NOTIFICATIONS = `${BASE_URL_FROM_ENV}/api/notifications/seenAll`;

const getNotificationsApi = async (notificationData: any) => {
  const config = {
    method: "get",
    url: API_GET_NOTIFICATION,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${notificationData.token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const getCountOfNotificationsApi = async (notificationData: any) => {
  const config = {
    method: "get",
    url: API_COUNT_OF_NOTIFICATIONS,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${notificationData.token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const readAllNotificationsApi = async (token: string) => {
  const config = {
    method: "post",
    url: API_READ_ALL_NOTIFICATIONS,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api(config);
  return response.data;
};

const NotificationService = {
  getNotificationsApi,
  getCountOfNotificationsApi,
  readAllNotificationsApi,
};
export default NotificationService;
