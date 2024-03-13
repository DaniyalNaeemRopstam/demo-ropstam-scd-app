import axios from "axios";
import { BASE_URL_FROM_ENV } from "@env";
import { store } from "../app/store";
import { deleteToken } from "../features/AuthSlice";

const api = axios.create({
  baseURL: BASE_URL_FROM_ENV,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      // Check if the error response status is 500
      if (error.response && error.response.status === 500) {
        // Perform logout or other necessary actions
        store.dispatch(deleteToken());
      }
      return Promise.reject(error);
    }
  }
);

export default api;
