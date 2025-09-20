import type { AxiosRequestConfig } from "axios";
import { axiosInstance, networkFirst } from "../../../../../services";

// export const GetArms = (config?: AxiosRequestConfig<any> | undefined) => {
//     // return axiosInstance.get(, config);
// }

export const fetchEvents = (type = 'ongoing', config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`events/${type}/fetch`), config);

export const fetchAnnouncments = (config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`messages/fetch`), config);

export const markAttendance = (event_id: number, data: Record<string, any>, type = 'mark', config?: AxiosRequestConfig<any> | undefined) => axiosInstance.post(`events/${event_id}/attendance/${type}`, data, config);

// export const unMarkAttendance = (event_id: number, data: Record<string, any>, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.post(`events/attendance/${event_id}/`, data, config);

export const readAnnouncments = (attendance_id: number, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.patch(`messages/${attendance_id}/read`, config);

export const fetchDocs = (config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`docs/fetch`), config);

export const fetchUsersForAttendance = (eid: string, searchTerm: string, config?: AxiosRequestConfig<any> | undefined) => axiosInstance.get(networkFirst(`users/events/${eid}/attendance/fetch${searchTerm.trim().length > 0 ? '?search=' + searchTerm : ''}`), config);