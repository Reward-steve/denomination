import type { FC } from "react";
import FormInput from "../../../../../components/ui/FormInput";
import { FaCalendarAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../../../../hooks/useAuth";
import moment from "moment";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "../../../../../components/ui/Button";

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
    (withBG ? "bg-text-ptext-text-placeholder 2ext-text" : "text-text")
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

const DashedSeparator: FC = () => (
  <div className="relative h-1 my-4">
    <div className="absolute top-0 left-0 right-0 border-t border-dashed border-border"></div>
  </div>
);

const ReceiptDetail: FC<{
  label: string;
  value: string | null | undefined;
  strongValue?: boolean;
  isMonospace?: boolean;
}> = ({ label, value, strongValue = false, isMonospace = false }) => (
  <div className="flex justify-between items-start text-sm">
    <span className="text-text-secondary font-medium">{label}</span>
    <span
      className={`text-right text-text 
        ${strongValue ? "font-bold" : "font-semibold"} 
        ${isMonospace ? "font-mono text-xs sm:text-sm" : ""}`}
    >
      {value || "N/A"}
    </span>
  </div>
);

export const ReceiptContent: FC<{ txDetails: Transaction }> = ({
  txDetails,
}) => {
  const statusBGClass = DetermineStatusColor(txDetails.status, true);

  return (
    <div className="p-6 sm:p-8 max-w-sm w-full mx-auto rounded-2xl bg-background shadow-xl border border-border text-text receipt-paper">
      <div className="text-center pb-4">
        <h1 className="text-xl font-bold text-accent mb-1">
          UCCA Transaction Receipt
        </h1>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-xs tracking-wider ${statusBGClass} mb-3`}
        >
          {txDetails.status?.toUpperCase() || "PENDING"}
        </div>
      </div>

      <DashedSeparator />

      {/* --- Amount & Description (The focus) --- */}
      <div className="text-center py-4">
        <p className="text-sm font-medium text-text-placeholder">
          {txDetails.item_name || txDetails.event_name || "Payment Successful"}
        </p>
        <p className="text-5xl font-extrabold text-text mt-2">
          ₦{txDetails.amount.toLocaleString()}
        </p>
      </div>

      <DashedSeparator />

      {/* --- Transaction Details --- */}
      <div className="py-4 space-y-4 text-sm">
        {/* Key Detail Highlighted */}
        <ReceiptDetail
          label="Date & Time"
          value={
            txDetails.created_at
              ? moment(txDetails.created_at).format("MMM D, YYYY | h:mm:ss A")
              : "N/A"
          }
          strongValue={true}
        />
        <ReceiptDetail label="Payer/Recipient" value={txDetails.username} />
        <ReceiptDetail label="Description" value={txDetails.descr} />

        <DashedSeparator />

        <ReceiptDetail
          label="Transaction Reference"
          value={txDetails.reference ?? "N/A"}
          isMonospace={true}
        />
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

      <DashedSeparator />

      {/* --- Footer Message --- */}
      <div className="mt-4 text-center">
        <p className="text-xs text-text-placeholder italic">
          Thank you for using our service. This is a computer-generated receipt.
        </p>
      </div>
    </div>
  );
};

export const ReceiptActions: FC<{ txDetails: Transaction }> = ({
  txDetails,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  /* ----------- PRINT STYLES & HANDLER ----------- */
  // Use a string template for clean print-specific CSS
  const printStyles = `
    @page { margin: 10mm; }
    .print-hide { display: none !important; } 
    
    @media print {
      /* Hide everything except the receipt when printing */
      body > * { visibility: hidden !important; }
      .receipt-paper, .receipt-paper * { visibility: visible !important; }
      .receipt-paper {
        position: absolute;
        left: 0;
        top: 0;
        box-shadow: none !important;
        border: none !important;
        background: white !important;
        width: 100%;
        max-width: 100%;
        margin: 0 auto;
        padding: 0; 
      }
    }
  `;

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${txDetails.reference || txDetails.id}`,
    pageStyle: printStyles,
  });

  /* ----------- DOWNLOAD PDF HANDLER (High Quality) ----------- */
  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    // Temporarily remove component styling for cleaner canvas capture
    const originalStyles = receiptRef.current.style.cssText;
    receiptRef.current.style.boxShadow = "none";
    receiptRef.current.style.border = "none";
    receiptRef.current.style.background = "background";

    // Scroll to top for reliable capture
    const initialScrollY = window.scrollY;
    window.scrollTo(0, 0);

    try {
      // Use scale=3 for high-resolution canvas capture
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20; // 10mm margins on both sides
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Receipt-${txDetails.reference || txDetails.id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      window.scrollTo(0, initialScrollY);
      receiptRef.current.style.cssText = originalStyles;
    }
  };

  return (
    <div className="space-y-6">
      <style>{printStyles}</style>
      <div ref={receiptRef}>
        <ReceiptContent txDetails={txDetails} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto ">
        <Button onClick={handlePrint} variant="primary" className="w-full">
          Print Receipt
        </Button>
        <Button
          onClick={handleDownloadPDF}
          variant="primary"
          className="w-full"
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
};
