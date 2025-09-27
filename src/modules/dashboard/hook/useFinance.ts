// src/features/finance/hooks/useFinance.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  initPayment,
  fetchDepts,
  fetchTransactions,
  fetchAllTransactions,
  fetchStats,
  fetchUserTransactions,
} from "../services/finance";
import type { InitPaymentRequest } from "../types";
import { toast } from "react-toastify";

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
      // ✅ Notify user only once — clear, simple, non-intrusive
      toast.success("Payment initialized successfully ✅");

      // Refetch relevant queries to keep UI in sync
      queryClient.invalidateQueries({ queryKey: ["allTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["financeStats"] });
    },
    onError: (err: unknown) => {
      console.error("❌ Payment initialization failed:", err);

      // ⚠️ Only toast when it's a user-facing failure
      toast.error("Failed to initialize payment. Please try again.");
    },
  });
}

/* ---------------- QUERIES ---------------- */

/**
 * Fetch debts for a specific user.
 * ✅ No toast here — errors should be handled in UI, not spam users.
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
 * Fetch all user transactions for the system.
 */
export function useFetchUserTransactions(forAdmins:boolean) {
  return useQuery({
    queryKey: ["userTransactions"],
    queryFn: ()=>fetchUserTransactions(forAdmins),
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
