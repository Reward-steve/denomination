type TransactionFilters = {
  event?: string;
  date?: string; // format: YYYY-MM-DD
  month?: string; // format: MM
  year?: string; // format: YYYY
  search?: string;
  payment_method?: string;
  status?: string;
};
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

export const fetchAllTransactions = async (
  filters: TransactionFilters = {}
) => {
  // Build query string dynamically
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });

  return apiRequest(`txn/fetch?${query.toString()}`, "GET");
};

export const fetchUserTransactions = async (forAdmins: boolean) => {
  return apiRequest(
    `txn${forAdmins ? "/" : "/user/"}fetch?per_page=300`,
    "GET"
  ); //leave the per_page high to avoid pagination, till when we implement it
};

export const fetchStats = async () => {
  return apiRequest("txn/stats/fetch", "GET");
};
export const fetchPaymentItems = async () => {
  return apiRequest("lookups/payment-items/fetch", "GET");
};
