import { apiRequest } from "../../../services/apiResquest";
import type { PersonalInfoFormData, States } from "../../../types/auth.types";
import { buildFormData } from "../../../utils/appHelpers";

export const createUCCAUser = async (payload: PersonalInfoFormData) => {
  const formData = new FormData();
  buildFormData(formData, payload);

  return await apiRequest("users/create", "POST", formData, "no");
};

export const loginApi = async (payload: {
  phone: string;
  password: string;
}) => {
  const formData = new FormData();
  buildFormData(formData, payload);
  return await apiRequest("login", "POST", formData, "no");
};

export const fetchStates = async (): Promise<{
  data: States[] | null;
}> => {
  return await apiRequest("lookups/states/fetch", "GET");
};

export const fetchLGA = async (state_id: string) => {
  const endpoint = `lookups/${state_id}/lga/fetch`;
  return await apiRequest(endpoint, "GET");
};

export const fetchPosition = async () => {
  const endpoint = `lookups/positions/fetch`;
  return await apiRequest(endpoint, "GET");
};
