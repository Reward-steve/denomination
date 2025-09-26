// src/features/finance/hooks/useFinance.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  initPayment,
  fetchDepts,
  fetchTransactions,
  fetchAllTransactions,
  fetchStats,
} from "../services/finance";
import type { InitPaymentRequest /*PaymentItem*/ } from "../types";

/* ---------------- MUTATIONS ---------------- */

/**
 * Hook for initializing a payment.
 *
 * Ensures data sent matches InitPaymentRequest:
 * {
 *   user_id: number;
 *   payment_method: "cash" | "card" | "transfer";
 *   event_id: number;
 *   items: PaymentItem[];
 * }
 */
export function useInitPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InitPaymentRequest) => initPayment(payload),
    onSuccess: () => {
      // Refetch relevant queries to keep UI in sync
      queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["financeStats"] });
    },
    onError: (err: unknown) => {
      console.error("❌ Payment initialization failed:", err);
    },
  });
}

/* ---------------- QUERIES ---------------- */

/**
 * Fetch debts for a specific user.
 */
export function useFetchDebts(userId: number, enabled = true) {
  return useQuery({
    queryKey: ["debts", userId],
    queryFn: () => fetchDepts(userId),
    enabled: !!userId && enabled,
  });
}

/**
 * Fetch a single transaction by ID.
 */
export function useFetchTransaction(txnId: number, enabled = true) {
  return useQuery({
    queryKey: ["transaction", txnId],
    queryFn: () => fetchTransactions(txnId),
    enabled: !!txnId && enabled,
  });
}

/**
 * Fetch all transactions for the system.
 */
export function useFetchAllTransactions() {
  return useQuery({
    queryKey: ["allTransactions"],
    queryFn: fetchAllTransactions,
  });
}

/**
 * Fetch finance statistics (debts, dues, welfare, balance).
 */
export function useFetchStats() {
  return useQuery({
    queryKey: ["financeStats"],
    queryFn: fetchStats,
  });
}
