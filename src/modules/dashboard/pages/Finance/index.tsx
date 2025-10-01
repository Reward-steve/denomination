import { useState, type ReactNode } from "react";
import DashboardLayout from "../../components/Layout";
import { FaArrowUp, FaArrowDown, FaWallet, FaMoneyBill } from "react-icons/fa";
import { TbTransactionDollar } from "react-icons/tb";
import { Button } from "../../../../components/ui/Button";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { useFetchAllTransactions, useFetchStats } from "../../hook/useFinance";
import { PaymentModal } from "./components/PaymentModal";
import { DashboardHeader } from "../../components/Header";
import { FaArrowRight } from "react-icons/fa6";
import { BaseModal } from "../../../../components/ui/BaseModal";
import { Link } from "react-router-dom";
import {
  ReceiptActions,
  TransactionList,
  TransactionListSkeleton,
} from "./components/FinanceCom";
import { MapApiToTransactions } from "./txnHistory";

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

interface Stat {
  label: string;
  value: number;
  icon: ReactNode;
  color: string;
}

/* -------------------- Skeleton Loaders -------------------- */
function StatCardSkeleton() {
  return (
    <div className="p-4 rounded-xl bg-surface shadow flex items-center gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-border" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-border rounded w-3/4" />
        <div className="h-4 bg-border rounded w-1/2" />
      </div>
    </div>
  );
}

/* -------------------- Subcomponents -------------------- */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-surface shadow hover:shadow-lg transition-all flex items-center gap-3">
      {icon}
      <div>
        <p className="text-sm text-text-placeholder">{label}</p>
        <p className="text-lg font-bold text-text">{value}</p>
      </div>
    </div>
  );
}

/* -------------------- Main Component -------------------- */
export default function Finance() {
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [txDetails, setTxDetails] = useState<Transaction>();

  // Queries
  const {
    data: transactionData,
    isLoading: transactionsLoading,
    isError: transactionsError,
  } = useFetchAllTransactions();
  const {
    data: statsData,
    isLoading: statsLoading,
    isError: statsError,
  } = useFetchStats();

  const transactions = transactionData?.data
    ? MapApiToTransactions(transactionData.data)
    : [];

  const stats: Stat[] = statsData?.data
    ? [
        {
          label: "Total Debts",
          value: statsData.data.total_debts,
          icon: <FaArrowDown />,
          color: "text-red-500",
        },
        {
          label: "Dues Collected",
          value: statsData.data.dues_collected,
          icon: <FaArrowUp />,
          color: "text-green-500",
        },
        {
          label: "Welfare Collected",
          value: statsData.data.welfare_collected,
          icon: <FaMoneyBill />,
          color: "text-accent",
        },
        {
          label: "Total Balance",
          value: statsData.data.total_balance,
          icon: <FaWallet />,
          color: "text-accent",
        },
      ]
    : [];

  return (
    <DashboardLayout>
      <section className="space-y-8 animate-fade">
        <DashboardHeader
          title={`Finance`}
          description={
            "Track your payments, balances, and history in one place."
          }
          actionLabel={"Make Payment"}
          onAction={() => setShowPayment(true)}
        >
          <></>
        </DashboardHeader>

        {/* Stats Overview */}
        <section className="grid gap-4 sm:grid-cols-4">
          {statsLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : statsError ? (
            <p className="text-center text-error col-span-4">
              Failed to load stats.
            </p>
          ) : stats.length > 0 ? (
            stats.map((stat) => (
              <StatCard
                key={stat.label}
                icon={
                  <span className={`${stat.color} text-2xl shrink-0`}>
                    {stat.icon}
                  </span>
                }
                label={stat.label}
                value={`₦${stat.value.toLocaleString()}`}
              />
            ))
          ) : null}
        </section>

        {/* Transactions */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-text">
              Recent Transactions
            </h3>
          </div>

          {transactionsLoading ? (
            <TransactionListSkeleton />
          ) : transactionsError ? (
            <p className="text-center text-error py-8">
              Failed to load transactions.
            </p>
          ) : transactions.length > 0 ? (
            <TransactionList
              showName={true}
              transactions={transactions.slice(0, 5)}
              onSelect={(t: any) => {
                setTxDetails(t);
                setShowReceipt(true);
              }}
            />
          ) : (
            <EmptyState
              title="No Transactions"
              description="No transactions yet. Click “Make Payment” above to get started."
              icon={<TbTransactionDollar className="w-8 h-8 text-accent" />}
            />
          )}
        </section>

        <div className="flex w-full justify-end mt-[10px!important] max-[360px]:justify-center">
          <Link
            to={{
              pathname: "/dashboard/transaction-history",
              search: "?fromfinance=true",
            }}
          >
            <Button variant="primary" size="md" className="max-[360px]:w-full">
              <div className="flex gap-3 justify-center items-center">
                <span>See all Transactions</span> <FaArrowRight />
              </div>
            </Button>
          </Link>
        </div>

        {/* Payment Modal */}
        {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      </section>

      {/* reciept modal */}
      {/* Receipt Modal */}
      {showReceipt &&
        txDetails &&
        (console.log(txDetails),
        (
          <BaseModal
            title="Payment receipt"
            setClose={() => setShowReceipt(false)}
          >
            <ReceiptActions txDetails={txDetails} />
          </BaseModal>
        ))}
    </DashboardLayout>
  );
}
