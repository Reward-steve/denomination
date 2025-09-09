import { apiRequest } from "../../../services/apiResquest";
import type { LGA, Position, States } from "../../../types/auth.types";
import { buildFormData } from "../../../utils/appHelpers";

export const createUCCAUser = async (
  payload: any,
  photo?: File
): Promise<{
  success: boolean;
  message: string;
  data: { token: string; id: string } | null;
}> => {
  const formData = new FormData();
  buildFormData(formData, payload);
  if (photo) {
    formData.append("photo", photo);
  }
  return await apiRequest("users/create", "POST", formData, "no");
};

export const loginApi = async (
  payload: any
): Promise<{
  success: boolean;
  message: string;
  data: { token: string; id: string } | null;
}> => {
  const formData = new FormData();
  buildFormData(formData, payload);
  return await apiRequest("login", "POST", formData, "no");
};

export const fetchStates = async (): Promise<{
  success: boolean;
  message: string;
  data: States[] | null;
}> => {
  return await apiRequest("lookups/states/fetch", "GET");
};

export const fetchLGA = async (
  state_id: string
): Promise<{
  success: boolean;
  message: string;
  data: LGA[] | null;
}> => {
  const endpoint = `lookups/${state_id}/lga/fetch`;
  return await apiRequest(endpoint, "GET");
};

export const fetchPosition = async (): Promise<{
  success: boolean;
  message: string;
  data: Position[] | null;
}> => {
  const endpoint = `lookups/positions/fetch`;
  return await apiRequest(endpoint, "GET");
};
