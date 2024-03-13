import { BASE_URL_FROM_ENV } from "@env";
import api from "./axiosConfig";

const API_LOGIN_OTP = `${BASE_URL_FROM_ENV}/api/user/otp/login`;
const API_URL_VERIFY_OTP = `${BASE_URL_FROM_ENV}/api/user/otp/verified`;
const API_SIGNUP_EMAIL = `${BASE_URL_FROM_ENV}/api/user/register/email`;
const API_SIGNUP_NUMBER = `${BASE_URL_FROM_ENV}/api/user/register/phone`;
const API_CREATE_PASSWORD = `${BASE_URL_FROM_ENV}/api/user/update/password`;
const API_FORGOT_PASSWORD = `${BASE_URL_FROM_ENV}/api/user/forget`;
const API_LOGIN = `${BASE_URL_FROM_ENV}/api/user/login`;

const loginOtpApi = async (OtpData: any) => {
  const data = JSON.stringify({
    userID: OtpData?.userID,
    otp: OtpData?.otp,
    mobileToken: OtpData?.mobileToken,
  });

  const config = {
    method: "post",
    url: API_LOGIN_OTP,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const verifyOtpApi = async (OtpData: any) => {
  const data = JSON.stringify({
    userID: OtpData?.userID,
    otp: OtpData?.otp,
  });

  const config = {
    method: "put",
    url: API_URL_VERIFY_OTP,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const signUpEmailApi = async (emailData: any) => {
  const data = JSON.stringify({
    email: emailData.email,
    mobileToken: emailData.mobileToken,
  });
  const config = {
    method: "post",
    url: API_SIGNUP_EMAIL,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await api(config);
  return response.data;
};

const signUpNumberApi = async (phoneData: any) => {
  const data = JSON.stringify({
    phoneNumber: phoneData.phoneNumber,
    mobileToken: phoneData.mobileToken,
  });
  const config = {
    method: "post",
    url: API_SIGNUP_NUMBER,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  const response = await api(config);
  return response.data;
};

const loginUserApi = async (loginData: any) => {
  const data = JSON.stringify({
    loginValue: loginData?.loginValue,
    password: loginData?.password,
  });

  const config = {
    method: "post",
    url: API_LOGIN,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const createPasswordAPi = async (profileData: any) => {
  const config = {
    method: "put",
    url: API_CREATE_PASSWORD,
    headers: {
      "Content-Type": "application/json",
    },
    data: profileData,
  };

  const response = await api(config);
  return response.data;
};

const forgetPasswordApi = async (profileData: any) => {
  const data = {
    loginValue: profileData,
  };
  const config = {
    method: "post",
    url: API_FORGOT_PASSWORD,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await api(config);
  return response.data;
};

const AuthService = {
  loginOtpApi,
  verifyOtpApi,
  signUpEmailApi,
  createPasswordAPi,
  signUpNumberApi,
  loginUserApi,
  forgetPasswordApi,
};
export default AuthService;
