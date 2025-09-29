import type { FC } from "react";
import FormInput from "../../../../../components/ui/FormInput";
import { FaCalendarAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../../../hooks/useAuth";
import moment from "moment";

/* Types */
export type TransactionStatus = "successful" | "pending" | "failed";

export interface Transaction {
  id: number;
  status: TransactionStatus;
  username: string;
  amount: number;
  date?: string;
  reference?: string | null;
  from_date?: string | null;
  to_date?: string | null;
  payment_method?: string | null;
  payment_gateway?: string | null;
  event_name?: string | null;
  event_id?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  descr?: string | null;
  recurring?: number;
  item_name?: string | null;
}

export const DetermineStatusColor = (status?: string, withBG = true) => {
  const map: Record<string, string> = {
    successful: withBG ? "bg-green-500/20 text-green-600" : "text-green-600",
    pending: withBG ? "bg-yellow-500/20 text-yellow-600" : "text-yellow-600",
    failed: withBG ? "bg-red-500/20 text-red-600" : "text-red-600",
  };
  return (
    map[status || ""] ||
    (withBG ? "bg-gray-500 2ext-gray-800" : "text-gray-800")
  );
};

/* Date input wrapper */
export const DateFormInput: FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <FormInput
    id={`date-${label}`}
    label={label}
    type="date"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    icon={FaCalendarAlt}
  />
);

/* UI subcomponents */
export const TransactionListSkeleton: FC = () => (
  <ul
    className="divide-y divide-border rounded-xl bg-surface shadow"
    role="list"
  >
    {Array.from({ length: 5 }).map((_, i) => (
      <li
        key={i}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 animate-pulse"
      >
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-border rounded w-3/4" />
          <div className="h-3 bg-border rounded w-1/2" />
        </div>
        <div className="h-4 bg-border rounded w-16 shrink-0" />
      </li>
    ))}
  </ul>
);

export const TransactionList: FC<{
  showName?: boolean;
  transactions: Transaction[];
  onSelect: (t: Transaction) => void;
}> = ({ showName = false, transactions, onSelect }) => {
  const { user } = useAuth();
  const loc = useLocation();
  const fromFinance = Boolean(
    new URLSearchParams(loc.search).get("fromfinance")
  );

  return (
    <ul
      className="divide-y divide-border bg-surface rounded-xl shadow-sm"
      role="list"
    >
      {transactions.map((t) => {
        const statusBadgeClasses = DetermineStatusColor(t.status);
        return (
          <li
            key={t.id}
            role="button"
            tabIndex={-1}
            onClick={() => onSelect(t)}
            className="flex justify-between items-center p-4 hover:bg-background/60 transition cursor-pointer"
          >
            <div className="flex flex-col">
              {showName ? (
                <p className="font-semibold text-text">{t.username}</p>
              ) : (
                <p className="font-semibold text-text">
                  {user?.is_admin && fromFinance
                    ? t.username
                    : t.item_name || t.event_name || "Transaction"}
                </p>
              )}
              <p className="text-xs text-text-placeholder mt-1">
                {t.created_at
                  ? moment(t.created_at).format("MMM D, YYYY | hh:mm A")
                  : ""}
              </p>
              <p className="text-xs text-text-placeholder">
                {t.payment_method ?? "N/A"} • Ref: {t.reference ?? "N/A"}
              </p>
            </div>

            <div className="text-end shrink-0">
              <p
                className={`font-bold text-lg ${DetermineStatusColor(
                  t.status,
                  false
                )}`}
              >
                {t.status === "successful" ? "+" : ""}₦
                {t.amount.toLocaleString()}
              </p>
              <span
                className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full font-medium ${statusBadgeClasses}`}
              >
                {t.status
                  ? t.status.charAt(0).toUpperCase() + t.status.slice(1)
                  : "Unknown"}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export const ReceiptDetail: FC<{
  label: string;
  value?: any;
  valueClass?: string;
}> = ({ label, value, valueClass }) => {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex justify-between py-2 text-sm">
      <p className="text-text-placeholder">{label}</p>
      <p className={`font-semibold text-text text-end ${valueClass || ""}`}>
        {value}
      </p>
    </div>
  );
};

export const ReceiptContent: FC<{ txDetails: Transaction }> = ({
  txDetails,
}) => {
  const statusBGClass = DetermineStatusColor(txDetails.status, true);

  return (
    <div className="p-4 sm:p-6 max-w-[400px] mx-auto rounded-xl bg-background shadow-2xl border border-border">
      <div className="text-center pb-4 border-b border-dashed border-border/50">
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full font-medium text-sm ${statusBGClass} mb-3`}
        >
          {txDetails.status?.charAt(0).toUpperCase() +
            (txDetails.status?.slice(1) ?? "")}
        </div>
        <p className="text-4xl font-extrabold text-text">
          ₦{txDetails.amount.toLocaleString()}
        </p>
        <p className="text-sm text-text-placeholder mt-1">
          {txDetails.item_name || txDetails.event_name || "Payment"}
        </p>
      </div>

      <div className="pt-4 space-y-2">
        <ReceiptDetail
          label="Date & Time"
          value={
            txDetails.created_at
              ? moment(txDetails.created_at).format("MMM D, YYYY | hh:mm A")
              : undefined
          }
        />
        <ReceiptDetail label="Payment Item" value={txDetails.item_name} />
        <ReceiptDetail label="Event Name" value={txDetails.event_name} />
        <ReceiptDetail label="Description" value={txDetails.descr} />
        <ReceiptDetail label="Payer/Recipient" value={txDetails.username} />
        <ReceiptDetail
          label="Payment Method"
          value={txDetails.payment_method}
        />
        <ReceiptDetail
          label="Payment Gateway"
          value={txDetails.payment_gateway}
        />
        {txDetails?.recurring &&
          txDetails.recurring > 0 &&
          txDetails.from_date &&
          txDetails.to_date && (
            <ReceiptDetail
              label="Subscription Period"
              value={`${moment(txDetails.from_date).format(
                "MMM YYYY"
              )} - ${moment(txDetails.to_date).format("MMM YYYY")}`}
            />
          )}
      </div>

      <div className="mt-6 pt-4 border-t border-dashed border-border/50 text-center">
        <p className="text-xs text-text-placeholder">Transaction Reference</p>
        <p className="font-mono text-sm font-bold text-text mt-1">
          {txDetails.reference ?? "N/A"}
        </p>
      </div>
    </div>
  );
};
