// src/features/finance/hooks/useFinance.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  initPayment,
  fetchDepts,
  fetchTransactions,
  fetchAllTransactions,
} from "../services/finance";
import type { InitPaymentRequest } from "../types";

/* ---------------- MUTATIONS ---------------- */
export function useInitPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (finance: InitPaymentRequest) => initPayment(finance),
    onSuccess: () => {
      // Refetch transactions after successful payment
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
    },
    onError: (err: any) => {
      console.error("Payment init failed:", err);
    },
  });
}

/* ---------------- QUERIES ---------------- */
export function useFetchDebts(userId: number, enabled = true) {
  return useQuery({
    queryKey: ["debts", userId],
    queryFn: () => fetchDepts(userId),
    enabled: !!userId && enabled,
  });
}

export function useFetchTransaction(txnId: number, enabled = true) {
  return useQuery({
    queryKey: ["transaction", txnId],
    queryFn: () => fetchTransactions(txnId),
    enabled: !!txnId && enabled,
  });
}

export function useFetchAllTransactions() {
  return useQuery({
    queryKey: ["allTransactions"],
    queryFn: fetchAllTransactions,
  });
}
