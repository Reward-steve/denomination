import { useState } from "react";
import DashboardLayout from "../components/Layout";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import { Button } from "../../../components/ui/Button";

/* -------------------- Types -------------------- */
interface Transaction {
  id: number;
  type: "income" | "expense";
  description: string;
  amount: number;
  date: string;
}

/* -------------------- Component -------------------- */
export default function Finance() {
  const [transactions] = useState<Transaction[]>([
    {
      id: 1,
      type: "income",
      description: "Salary",
      amount: 2000,
      date: "2025-09-01",
    },
    {
      id: 2,
      type: "expense",
      description: "Groceries",
      amount: 150,
      date: "2025-09-03",
    },
    {
      id: 3,
      type: "expense",
      description: "Transport",
      amount: 50,
      date: "2025-09-05",
    },
  ]);

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
            Easily track your income and expenses. Your balance updates
            automatically so you always know where you stand.
          </p>
        </header>

        {/* Overview Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div
            className="p-4 rounded-xl bg-surface shadow hover:shadow-lg transition-all flex items-center gap-3"
            role="status"
            aria-label={`Total income: $${income}`}
          >
            <FaArrowUp className="text-green-500 text-2xl shrink-0" />
            <div>
              <p className="text-sm text-text-placeholder">Total Income</p>
              <p className="text-lg font-bold text-text">${income}</p>
            </div>
          </div>

          <div
            className="p-4 rounded-xl bg-surface shadow hover:shadow-lg transition-all flex items-center gap-3"
            role="status"
            aria-label={`Total expenses: $${expenses}`}
          >
            <FaArrowDown className="text-red-500 text-2xl shrink-0" />
            <div>
              <p className="text-sm text-text-placeholder">Total Expenses</p>
              <p className="text-lg font-bold text-text">${expenses}</p>
            </div>
          </div>

          <div
            className="p-4 rounded-xl bg-surface shadow hover:shadow-lg transition-all flex items-center gap-3"
            role="status"
            aria-label={`Balance: $${balance}`}
          >
            <FaWallet className="text-accent text-2xl shrink-0" />
            <div>
              <p className="text-sm text-text-placeholder">Balance</p>
              <p className="text-lg font-bold text-text">${balance}</p>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
            <h3 className="text-lg font-semibold text-text">
              Recent Transactions
            </h3>
            <Button
              variant="primary"
              size="sm"
              aria-label="Add a new transaction"
            >
              + Add Transaction
            </Button>
          </div>

          {transactions.length > 0 ? (
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
                    {t.type === "income" ? "+" : "-"}${t.amount}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-text-placeholder py-8">
              No transactions yet. Click <b>“Add Transaction”</b> above to get
              started.
            </p>
          )}
        </section>
      </section>
    </DashboardLayout>
  );
}
