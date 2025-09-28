import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../components/Layout";
import { TbTransactionDollar } from "react-icons/tb";
import { EmptyState } from "../../../../components/ui/EmptyState";
// import { useFetchUserTransactions } from "../../hook/useFinance";
import { PaymentModal } from "./components/PaymentModal";
import { BaseModal } from "../../../../components/ui/BaseModal";
import moment from "moment";
import { useAuth } from "../../../../hooks/useAuth";
import { useLocation } from "react-router-dom";
import { fetchUserTransactions } from "../../services/finance";

/* -------------------- Types -------------------- */
interface Transaction {
  id: number;
  status: "failed" | "successful" | "pending";
  username: string;
  amount: number;
  date: string;
  reference?: string;
  from_date?: string;
  to_date?: string;
  payment_method?: string;
  payment_gateway?: string | null;
  event_name?: string;
  event_id?: number | null;
  created_at?: string;
  updated_at?: string;
  descr: string | null;
  recurring: number;
  item_name?: string;
}

const determineStatusColor = (status: string, withBG = true) => {
  switch (status) {
    case "successful":
      return withBG ? "bg-green-100" : "text-green-800";
    case "pending":
      return withBG ? "bg-yellow-100" : "text-yellow-800";
    case "failed":
      return withBG ? "bg-red-100" : "text-red-800";
    default:
      return withBG ? "bg-gray-100" : "text-gray-800";
  }
};

function TransactionListSkeleton() {
  return (
    <ul
      className="divide-y divide-border rounded-xl bg-surface shadow"
      role="list"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <li
          key={index}
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
}

/* -------------------- Helpers -------------------- */
function mapApiToTransactions(apiData: any[]): Transaction[] {
  return apiData.map((txn) => ({
    id: txn.id,
    status: txn.status,
    username: `${txn.first_name} ${txn.last_name}`,
    amount: Number(txn.amount),
    date: txn.created_at.split(" ")[0],
    payment_method: txn.payment_method,
    payment_gateway: txn.payment_gateway,
    event_id: txn.event_id,
    event_name: txn.event_name,
    reference: txn.reference,
    descr: txn.descr,
    recurring: txn.recurring,
    created_at: txn.created_at,
    updated_at: txn.updated_at,
    from_date: txn.from_date,
    to_date: txn.to_date,
    item_name: txn.item_name,
  }));
}

/* -------------------- Main Component -------------------- */
export default function TransactionHistory() {
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [txDetails, setTxDetails] = useState<Transaction>();

  const { user } = useAuth();
  const loc = useLocation();
  // const param = useParams();
  const searchParams = new URLSearchParams(loc.search);
  const fromFinance = !!searchParams.get('fromfinance');
  const forAdmins = (user?.is_admin && fromFinance) || false;
  const df = useRef(false);
  // const { data: transactionData, isLoading: transactionsLoading, isError: transactionsError } = useFetchUserTransactions(forAdmins);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState(false);
  useEffect(() => {
    df.current = forAdmins;

    fetchUserTransactions(df.current).then((res) => {
      setTransactionData({ ...res });
    }).catch(() => {
      setTransactionsError(true);
    }).finally(() => {
      setTransactionsLoading(false);
    });
  }, [])

  const transactions: Transaction[] = transactionData?.data
    ? mapApiToTransactions(transactionData.data)
    : [];

  useEffect(() => {
    console.log(transactionData); // Access like an object property
  }, [transactionData]);

  return (
    <DashboardLayout>
      <div className="sticky top-6 text-text my-4 text-lg font-semibold">
        Transactions
      </div>
      <section className="space-y-8 animate-fade">
        {/* Transactions */}
        <section>
          {transactionsLoading ? (
            <TransactionListSkeleton />
          ) : transactionsError ? (
            <p className="text-center text-error py-8">
              Failed to load transactions.
            </p>
          ) : transactions.length > 0 ? (
            <TransactionList
              transactions={transactions}
              showDetails={setShowReceipt}
              _setTxDetails={setTxDetails}
            />
          ) : (
            <EmptyState
              title="No Transactions"
              description="No transactions yet. Click “Make Payment” above to get started."
              icon={<TbTransactionDollar className="w-8 h-8 text-accent" />}
            />
          )}
        </section>

        {/* Payment Modal */}
        {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      </section>

      {/* reciept modal */}
      {showReceipt && (
        <BaseModal
          title="Payment receipt"
          setClose={() => setShowReceipt(false)}
        >
          <div className="flex justify-center items-center w-full mb-4">
            <ul
              className="divide-y divide-border bg-background rounded-xl max-w-[600px] w-full my-4 shadow"
              role="list"
              aria-label="Receipt details"
            >
              <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                <p className="text-text-placeholder text-sm">Name</p>
                <p className="font-medium text-text truncate">
                  {txDetails?.username}
                </p>
              </li>
              <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                <p className="text-text-placeholder text-sm">
                  Associated event
                </p>
                <p className="font-medium text-text truncate">
                  {txDetails?.event_name}
                </p>
              </li>
              <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                <p className="text-text-placeholder text-sm">Amount</p>
                <p className="font-medium text-text truncate">
                  ₦{Number(txDetails?.amount).toLocaleString()}
                </p>
              </li>
              <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                <p className="text-text-placeholder text-sm">Payment item</p>
                <p className="font-medium text-text truncate">
                  {txDetails?.item_name}
                </p>
              </li>
              {txDetails?.descr && txDetails.descr.trim().length > 0 && (
                <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                  <p className="text-text-placeholder text-sm">Description</p>
                  <p className="font-medium text-text truncate">
                    {txDetails?.descr}
                  </p>
                </li>
              )}
              <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                <p className="text-text-placeholder text-sm">Payment method</p>
                <p className="font-medium text-text truncate">
                  {txDetails?.payment_method}
                </p>
              </li>
              <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                <p className="text-text-placeholder text-sm">Status</p>
                <p
                  className={`font-medium text-text truncate px-1 rounded ${determineStatusColor(
                    txDetails?.status || "",
                    false
                  )}`}
                >
                  {txDetails?.status}
                </p>
              </li>

              {txDetails?.recurring && (
                <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                  <p className="text-text-placeholder text-sm">
                    Period paid for
                  </p>
                  <p className="font-medium text-text truncate">
                    {new Date(txDetails?.from_date || "").getFullYear() ===
                      new Date().getFullYear()
                      ? moment(txDetails?.from_date || "").format("MMM")
                      : moment(txDetails?.from_date).format("MMM YYYY")}{" "}
                    - {moment(txDetails?.to_date).format("MMM YYYY")}{" "}
                  </p>
                </li>
              )}

              <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                <p className="text-text-placeholder text-sm">Date</p>
                <p className="font-medium text-text truncate">
                  {moment(txDetails?.created_at).format("MMM D, YYYY")}
                </p>
              </li>
              <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
                <p className="text-text-placeholder text-sm">Reference</p>
                <p className="font-medium text-text truncate">
                  {txDetails?.reference}
                </p>
              </li>
            </ul>
          </div>
        </BaseModal>
      )}
    </DashboardLayout>
  );
}

function TransactionList({
  transactions,
  showDetails,
  _setTxDetails,
}: {
  transactions: Transaction[];
  showDetails: any;
  _setTxDetails: (x: Transaction) => void;
}) {

  const { user } = useAuth();
  const loc = useLocation();
  // const param = useParams();
  const searchParams = new URLSearchParams(loc.search);
  const fromFinance = searchParams.get('fromfinance');

  return (
    <ul
      className="divide-y divide-border rounded-xl bg-surface shadow"
      role="list"
      aria-label="transactions"
    >
      {transactions.map((t) => {
        const statusStyles =
          t.status === "successful"
            ? "bg-green-100 text-green-800"
            : t.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800";
        return (
          <li
            key={t.id}
            role="button"
            tabIndex={-1}
            onClick={() => {
              showDetails(true);
              _setTxDetails(t);
            }}
            className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4 hover:bg-background/60 transition"
          >
            <div className="min-w-0">
              <p className="font-medium text-text truncate">{(user?.is_admin && fromFinance) ? t.username : t.item_name}</p>
              <p className="text-sm text-text-placeholder">{t.date}</p>

              <small className={`text-xs ${statusStyles} px-1 rounded`}>
                {t.status}
              </small>
            </div>

            <div className=" min-w-0 text-end">
              <p className="text-text text-sm">{t.payment_method}</p>

              <p
                className={`font-semibold shrink-0 
            ${t.status === "successful"
                    ? "text-green-500"
                    : t.status === "pending"
                      ? "text-text-placeholder"
                      : "text-red-500"
                  }`}
              >
                {t.status === "successful" ? "+" : ""}₦
                {t.amount.toLocaleString()}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
