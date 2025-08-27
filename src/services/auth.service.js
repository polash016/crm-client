// import { axiosInstance } from "@/helpers/axios/axiosInstance";
import { decodedToken } from "@/utils/jwt";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from "@/utils/localStorage";
import { deleteCookies } from "./actions/deleteCookies";
import { authKey } from "@/constant/authKey";
import { axiosInstance } from "@/helpers/axios/axiosInstance";

export const storeUserInfo = (accessToken) => {
  return saveToLocalStorage(authKey, accessToken);
};

export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    const decodedData = decodedToken(authToken);

    return {
      ...decodedData,
    };
  }
};

export const isLoggedIn = () => {
  try {
    const authToken = getFromLocalStorage(authKey);
    if (!authToken) return false;

    // Check if token is expired
    const decodedData = decodedToken(authToken);
    if (!decodedData) return false;

    // Check if token is expired (exp is in seconds)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedData.exp && decodedData.exp < currentTime) {
      removeFromLocalStorage(authKey);
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const logOut = (router) => {
  removeFromLocalStorage(authKey);
  deleteCookies([authKey, "refreshToken"]);

  router.push("/");
  router.refresh();
};

export const getNewAccessToken2 = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SHEBA_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    if (!response.ok) throw new Error("Token refresh failed");

    return response.json();
  } catch (error) {
    throw error;
  }
};

export const getNewAccessToken = async () => {
  try {
    const response = await axiosInstance({
      url: `${process.env.NEXT_PUBLIC_SHEBA_API_URL}/auth/refresh-token`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    // Preserve network error flag if it exists
    if (error.isNetworkError) {
      throw error;
    }
    throw new Error(error.message || "Failed to refresh token");
  }
};
