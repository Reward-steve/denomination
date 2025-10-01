import type { AxiosRequestConfig } from "axios";
import { axiosInstance, networkFirst } from "../../../../../services";
import { objectToQueryParam } from "../../../../../utils/appHelpers";
import { apiRequest } from "../../../../../services/apiResquest";
import type { PersonalInfoFormData } from "../../../../../types/auth.types";

export const fetchUsers = (
  options: Record<string, any>,
  config?: AxiosRequestConfig<any> | undefined
) =>
  axiosInstance.get(
    networkFirst(`users/fetch${objectToQueryParam(options)}`),
    config
  );

export const MakeAdmin = (
  uid: string | number,
  config?: AxiosRequestConfig<any> | undefined
) => axiosInstance.post(`users/${uid}/admin/make`, config);

export const fetchUserById = (uid: string) =>
  axiosInstance.get(networkFirst(`users/${uid}/fetch`));

export const updateProfile = async (
  payload: FormData | Omit<PersonalInfoFormData, "photo">
) => {
  return apiRequest("users/update", "POST", payload);
};

export const updatePassword = async (payload: any) => {
  return apiRequest("users/update", "PUT", payload);
};
