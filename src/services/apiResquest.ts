import { XCache, axiosInstance } from "./index";
import { getFromStore } from "../utils/appHelpers";

export const apiRequest = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: object | FormData,
  xcache: "cf" | "nf" | "swr" | "co" | "no" = "no"
): Promise<{
  success: boolean;
  message: string;
  data: any;
  errors?: string[];
}> => {
  const url = XCache(`${endpoint}`, xcache);

  const token = getFromStore<string>("tk", "local");
  const user = getFromStore<{ id: string }>("curr_user", "local");
  const userId = user?.id ?? null;

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId ? { user_id: userId } : {}),
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
    let errors: string[] = [];

    if (error.response?.data) {
      const responseData = error.response.data;

      if (responseData.errors) {
        // Collect all messages into a flat array
        errors = Object.values(responseData.errors).flatMap((err: any) =>
          Array.isArray(err) ? err : [err]
        );
        message = responseData.message || errors[0] || "Validation failed";
      } else if (typeof responseData.message === "string") {
        message = responseData.message;
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
      errors,
    };
  }
};
