import { useState, type ReactNode } from "react";
import DashboardLayout from "../../components/Layout";
import { FaArrowUp, FaArrowDown, FaWallet, FaMoneyBill } from "react-icons/fa";
import { TbTransactionDollar } from "react-icons/tb";
import { Button } from "../../../../components/ui/Button";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { useFetchAllTransactions, useFetchStats } from "../../hook/useFinance";
import { PaymentModal } from "./components/PaymentModal";

/* -------------------- Types -------------------- */
interface Transaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
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
  return apiData.map((txn) => ({
    id: txn.id,
    type: Number(txn.amount) > 0 ? "income" : "expense",
    description: `${txn.first_name} ${txn.last_name} - ${txn.payment_method}`,
    amount: Number(txn.amount),
    date: txn.created_at.split(" ")[0],
  }));
}

/* -------------------- Main Component -------------------- */
export default function Finance() {
  const [showPayment, setShowPayment] = useState(false);

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
        <header>
          <h2 className="text-2xl font-bold text-text">Finance</h2>
          <p className="text-text-placeholder mt-1">
            Track your payments, balances, and history in one place.
          </p>
        </header>

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
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowPayment(true)}
            >
              + Make Payment
            </Button>
          </div>

          {transactionsLoading ? (
            <TransactionListSkeleton />
          ) : transactionsError ? (
            <p className="text-center text-error py-8">
              Failed to load transactions.
            </p>
          ) : transactions.length > 0 ? (
            <TransactionList transactions={transactions} />
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

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <ul
      className="divide-y divide-border rounded-xl bg-surface shadow"
      role="list"
      aria-label="Recent transactions"
    >
      {transactions.map((t) => (
        <li
          key={t.id}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 hover:bg-surface/70 transition"
        >
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text truncate">{t.description}</p>
            <p className="text-sm text-text-placeholder">{t.date}</p>
          </div>
          <p
            className={`font-semibold shrink-0 ${
              t.type === "income" ? "text-green-500" : "text-red-500"
            }`}
          >
            {t.type === "income" ? "+" : "-"}₦{t.amount.toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
