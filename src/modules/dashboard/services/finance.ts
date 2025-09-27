// import { fetcher } from "../../../services";
import { apiRequest } from "../../../services/apiResquest";
import type { InitPaymentRequest } from "../types";

export const initPayment = async (finance: InitPaymentRequest) => {
  return apiRequest("txn/init", "POST", finance);
};

export const fetchDepts = async (user_id: number) => {
  return apiRequest(`debtors/${user_id}/fetch`, "GET");
};

export const fetchTransactions = async (txn_id: number) => {
  return apiRequest(`txn/${txn_id}/fetch`, "GET");
};

export const fetchAllTransactions = async () => {
  return apiRequest("txn/fetch", "GET");
};
export const fetchUserTransactions = async (forAdmins: boolean) => {
  return apiRequest(`txn${forAdmins ? '/' : '/user/'}fetch?per_page=300`, "GET");//leave the per_page high to avoid pagination, till when we implement it
};
export const fetchStats = async () => {
  return apiRequest("txn/stats/fetch", "GET");
};
export const fetchPaymentItems = async () => {
  return apiRequest("lookups/payment-items/fetch", "GET");
};
