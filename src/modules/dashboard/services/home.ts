import type { AxiosRequestConfig } from "axios";
import { axiosInstance, networkFirst } from "../../../services";

// export const GetArms = (config?: AxiosRequestConfig<any> | undefined) => {
//     // return axiosInstance.get(, config);
// }

export const fetchEvents = (type = 'ongoing', config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`events/${type}/fetch`), config);

export const fetchAnnouncments = (config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`messages/fetch`), config);

export const readAnnouncments = (aid: number, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.patch(networkFirst(`messages/${aid}/read`), config);

export const fetchDocs = (config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`docs/fetch`), config);