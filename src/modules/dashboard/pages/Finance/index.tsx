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

/* -------------------- Types -------------------- */
interface Transaction {
  id: number;
  status: "failed" | "successful" | "pending";
  username: string;
  amount: number;
  date: string;
  payment_method: string;
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
  return (apiData.length = 5, apiData.map((txn) => ({
    id: txn.id,
    status: txn.status,
    username: `${txn.first_name} ${txn.last_name}`,
    amount: Number(txn.amount),
    date: txn.created_at.split(" ")[0],
    payment_method: txn.payment_method,
  })));
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

  const transactions: Transaction[] = transactionData?.data
    ? mapApiToTransactions(transactionData.data)
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
        {/* Header */}
        {/* <header>
          <h2 className="text-2xl font-bold text-text">Finance</h2>
          <p className="text-text-placeholder mt-1">
            
          </p>
        </header> */}

        <DashboardHeader
          title={`Finance`}
          description={"Track your payments, balances, and history in one place."}
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
            <TransactionList transactions={transactions} showDetails={setShowReceipt} _setTxDetails={setTxDetails} />
          ) : (
            <EmptyState
              title="No Transactions"
              description="No transactions yet. Click “Make Payment” above to get started."
              icon={<TbTransactionDollar className="w-8 h-8 text-accent" />}
            />
          )}
        </section>
        <div className="flex w-full justify-end mt-[10px!important] max-[360px]:justify-center">
          <Button
            variant="primary"
            size="md" className="max-[360px]:w-full"
            onClick={() => setShowPayment(true)}
          >
            <div className="flex gap-3 justify-center items-center"><span>See all Transactions</span>  <FaArrowRight /></div>
          </Button>
        </div>

        {/* Payment Modal */}
        {showPayment && <PaymentModal onClose={() => setShowPayment(false)} />}
      </section>

      {/* reciept modal */}
      {showReceipt && <BaseModal
        title="Payment receipt"
        setClose={() => setShowReceipt(false)}>
        <ul className="divide-y divide-border bg-background rounded-xl my-4 shadow" role="list" aria-label="Receipt details" >

          {/* const statusStyles = t.status === "successful" ? "bg-green-100 text-green-800" : t.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"; */}


          <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
              <p className="text-text-placeholder text-sm">Name</p>
              <p className="font-medium text-text truncate">{txDetails?.username}</p>
          </li>
          <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
              <p className="text-text-placeholder text-sm">Name</p>
              <p className="font-medium text-text truncate">{txDetails?.username}</p>
          </li>
          <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
              <p className="text-text-placeholder text-sm">Name</p>
              <p className="font-medium text-text truncate">{txDetails?.username}</p>
          </li>
          <li className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4">
              <p className="text-text-placeholder text-sm">Name</p>
              <p className="font-medium text-text truncate">{txDetails?.username}</p>
          </li>
         

        </ul>
      </BaseModal>}

    </DashboardLayout>
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

function TransactionList({ transactions, showDetails, _setTxDetails }: { transactions: Transaction[], showDetails: any, _setTxDetails: (x: Transaction) => void }) {

  return (
    <ul
      className="divide-y divide-border rounded-xl bg-surface shadow"
      role="list"
      aria-label="Recent transactions"
    >
      {transactions.map((t) => {
        const statusStyles = t.status === "successful" ? "bg-green-100 text-green-800" : t.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800";
        return (
          <li key={t.id} role="button" tabIndex={-1} onClick={() => { showDetails(true); _setTxDetails(t) }} className="flex cursor-pointer overflow-hidden flex-row justify-between gap-2 p-4 hover:bg-background/60 transition">

            <div className="min-w-0">
              <p className="font-medium text-text truncate">{t.username}</p>
              <p className="text-sm text-text-placeholder">{t.date}</p>

              <small className={`text-xs ${statusStyles} px-1 rounded`}>{t.status}</small>
            </div>

            <div className=" min-w-0 text-end">
              <p className="text-text text-sm">{t.payment_method}</p>

              <p className={`font-semibold shrink-0 
            ${t.status === "successful" ? "text-green-500" : t.status === "pending" ? "text-text-placeholder" : "text-red-500"}`}>
                {t.status === "successful" ? "+" : ''}₦{t.amount.toLocaleString()}
              </p>
            </div>


          </li>
        )
      }
      )}
    </ul>
  );
}
