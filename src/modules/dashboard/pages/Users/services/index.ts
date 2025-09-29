import type { AxiosRequestConfig } from "axios";
import { axiosInstance, networkFirst } from "../../../../../services";
import { objectToQueryParam } from "../../../../../utils/appHelpers";
// import { apiRequest } from "../../../../../services/apiResquest";

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

// export const updateUserProfile = (body: any) =>
//   apiRequest("users/create", "POST", body);
