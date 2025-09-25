// src/features/finance/pages/Finance.tsx
import DashboardLayout from "../../components/Layout";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import { Button } from "../../../../components/ui/Button";
import { useFetchAllTransactions } from "../../hook/useFinance";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { TbTransactionDollar } from "react-icons/tb";

/* -------------------- Types -------------------- */
interface Transaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
}

/* -------------------- Helpers -------------------- */
function mapApiToTransactions(apiData: any[]): Transaction[] {
  return apiData.map((txn) => ({
    id: txn.id,
    type: Number(txn.amount) > 0 ? "income" : "expense",
    description: `${txn.first_name} ${txn.last_name} - ${txn.payment_method}`,
    amount: Number(txn.amount),
    date: txn.created_at.split(" ")[0], // only date part
  }));
}

/* -------------------- Component -------------------- */
export default function Finance() {
  const { data, isLoading, isError } = useFetchAllTransactions();

  const transactions: Transaction[] = data?.data
    ? mapApiToTransactions(data.data)
    : [];

  // Calculate totals
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  return (
    <DashboardLayout>
      <section className="space-y-8 animate-fade">
        {/* Page Header */}
        <header>
          <h2 className="text-2xl font-bold text-text">Finance</h2>
          <p className="text-text-placeholder mt-1">
            Track your payments, balances, and history in one place.
          </p>
        </header>

        {/* Overview Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={<FaArrowUp className="text-green-500 text-2xl shrink-0" />}
            label="Total Income"
            value={`₦${income.toLocaleString()}`}
          />
          <StatCard
            icon={<FaArrowDown className="text-red-500 text-2xl shrink-0" />}
            label="Total Expenses"
            value={`₦${expenses.toLocaleString()}`}
          />
          <StatCard
            icon={<FaWallet className="text-accent text-2xl shrink-0" />}
            label="Balance"
            value={`₦${balance.toLocaleString()}`}
          />
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-text">
              Recent Transactions
            </h3>
            <Button variant="primary" size="sm">
              + Make Payment
            </Button>
          </div>

          {isLoading ? (
            <p className="text-center text-text-placeholder py-8">
              Loading transactions...
            </p>
          ) : isError ? (
            <p className="text-center text-error py-8">
              Failed to load transactions.
            </p>
          ) : transactions.length > 0 ? (
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
                    <p className="font-medium text-text truncate">
                      {t.description}
                    </p>
                    <p className="text-sm text-text-placeholder">{t.date}</p>
                  </div>
                  <p
                    className={`font-semibold shrink-0 ${
                      t.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}₦
                    {t.amount.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="No Transactions"
              description="No transactions yet. Click “Make Payment” above to get
              started."
              icon={<TbTransactionDollar className="w-8 h-8 text-accent" />}
            />
          )}
        </section>
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
  icon: React.ReactNode;
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
