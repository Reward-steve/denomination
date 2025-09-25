import type { AxiosRequestConfig } from "axios";
import { axiosInstance, networkFirst } from "../../../../../services";
import { objectToQueryParam } from "../../../../../utils/appHelpers";

export const CreateAnnc = (data: Record<string, any>, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.post(`messages/create`, data, config);

export const UpdateAnnc = (data: Record<string, any>, aid: number, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.patch(`messages/${aid}/update`, data, config);

export const ReadAnnc = (aid: number, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.patch(`messages/${aid}/read`, config);

export const DeleteAnnc = (aid: number, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.delete(`messages/${aid}/del`, config);

export const FetchAnnc = (options: Record<string, any>, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`messages/fetch${objectToQueryParam(options)}`), config);