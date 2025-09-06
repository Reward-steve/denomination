import { XCache, axiosInstance } from "./index";
import { getFromStore } from "../utils/appHelpers";

export const apiRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: object | FormData,
  xcache: "cf" | "nf" | "swr" | "co" | "no" = "no"
): Promise<{ success: boolean; message: string; data: T | null }> => {
  const url = XCache(`${endpoint}`, xcache);

  const token = getFromStore("token");
  const userData = getFromStore("user_id") as { id: string };
  const userId = userData ? userData.id : null;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId ? { "X-School-ID": userId } : {}),
  };

  try {
    const response = await axiosInstance.request({
      url,
      method,
      data: body,
      headers,
    });

    return {
      success: true,
      message: response.data?.message || "Request successful",
      data: response.data?.data || null,
    };
  } catch (error: any) {
    let message = "An unknown error occurred";
    let data = null;

    if (error.response?.data) {
      const responseData = error.response.data;
      if (typeof responseData.message === "string") {
        message = responseData.message;
      } else if (responseData.errors) {
        const firstError = Object.values(responseData.errors)[0];
        message = Array.isArray(firstError)
          ? firstError[0]
          : firstError || "Request failed";
      } else {
        message = "Request failed with server error.";
      }
      data = responseData;
    } else if (error.message) {
      message = error.message;
    }

    console.error("API Request Error:", message, data || error);

    return {
      success: false,
      message,
      data: null,
    };
  }
};
