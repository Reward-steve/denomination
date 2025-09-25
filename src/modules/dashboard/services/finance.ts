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
