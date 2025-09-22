import type { AxiosRequestConfig } from "axios";
import { axiosInstance, networkFirst } from "../../../../../services";
import { objectToQueryParam } from "../../../../../utils/appHelpers";

export const fetchUsers = (options: Record<string, any>, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`users/fetch${objectToQueryParam(options)}`), config);