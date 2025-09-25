import type { AxiosRequestConfig } from "axios";
import { axiosInstance, networkFirst } from "../../../../../services";
import { objectToQueryParam } from "../../../../../utils/appHelpers";

export const fetchUsers = (options: Record<string, any>, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`users/fetch${objectToQueryParam(options)}`), config);

export const MakeAdmin = (uid: string | number, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.post(`users/${uid}/admin/make`, config);

//users/:user_id/admin/make