// src/features/finance/pages/Finance.tsx
import { useState, type ReactNode } from "react";
import DashboardLayout from "../../components/Layout";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import { TbTransactionDollar } from "react-icons/tb";
import { Button } from "../../../../components/ui/Button";
import { EmptyState } from "../../../../components/ui/EmptyState";
import ReactDOM from "react-dom";
import {
  useFetchAllTransactions,
  // useInitPayment,
  useFetchDebts,
  useFetchTransaction,
} from "../../hook/useFinance";
import { BaseModal } from "../../../../components/ui/BaseModal";
// import type { InitPaymentRequest } from "../../types";

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
    date: txn.created_at.split(" ")[0],
  }));
}

/* -------------------- Main Component -------------------- */
export default function Finance() {
  const [showPayment, setShowPayment] = useState(false);

  // Queries
  const { data, isLoading, isError } = useFetchAllTransactions();
  const { data: debts } = useFetchDebts(1, false);
  const { data: txnDetail } = useFetchTransaction(10, false);

  const transactions: Transaction[] = data?.data
    ? mapApiToTransactions(data.data)
    : [];

  // Totals
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
        {/* Header */}
        <header>
          <h2 className="text-2xl font-bold text-text">Finance</h2>
          <p className="text-text-placeholder mt-1">
            Track your payments, balances, and history in one place.
          </p>
        </header>

        {/* Overview */}
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

          {isLoading ? (
            <p className="text-center text-text-placeholder py-8">
              Loading transactions...
            </p>
          ) : isError ? (
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

        {/* Debugging/Preview sections */}
        {debts && <PreviewBlock title="Debts Preview" data={debts} />}
        {txnDetail && (
          <PreviewBlock title="Transaction Detail" data={txnDetail} />
        )}

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

function PreviewBlock({ title, data }: { title: string; data: unknown }) {
  return (
    <section>
      <h3 className="font-semibold">{title}</h3>
      <pre className="text-xs bg-surface p-2 rounded-lg overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}

/* -------------------- Payment Modal -------------------- */
function PaymentModal({ onClose }: { onClose: () => void }) {
  // const { mutate, isPending } = useInitPayment();

  const handlePay = () => {
    // mutate({ amount: 5000, method: "card" }, { onSuccess: onClose });
  };

  // Render modal into document.body using portal
  return ReactDOM.createPortal(
    <BaseModal title="Make Payment" isOpen setClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-text-placeholder">
          Confirm payment of ₦5,000 using your card.
        </p>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handlePay}
            // disabled={isPending}
          >
            {/* {isPending ? "Processing..." : "Pay ₦5,000"} */}Pay ₦5,000
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </BaseModal>,
    document.body
  );
}

// /* -------------------- Payment Modal -------------------- */
// function PaymentModal({ onClose }: { onClose: () => void }) {
//   const { mutate, isPending } = useInitPayment();

//   // Form state
//   const [paymentMethod, setPaymentMethod] =
//     useState<InitPaymentRequest["payment_method"]>("card");

//   const [items, setItems] = useState<PaymentItem[]>([
//     {
//       id: 1,
//       unit_price: 5000,
//       units: 1,
//       from: new Date().toISOString(),
//       to: new Date().toISOString(),
//     },
//   ]);

//   const handlePay = () => {
//     const payload: InitPaymentRequest = {
//       user_id: 1, // TODO: replace with actual logged-in user_id
//       event_id: 123, // TODO: replace with real event_id
//       payment_method: paymentMethod,
//       items,
//     };

//     mutate(payload, { onSuccess: onClose });
//   };

//   // Add new item row
//   const addItem = () => {
//     setItems((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         unit_price: 0,
//         units: 1,
//         from: new Date().toISOString(),
//         to: new Date().toISOString(),
//       },
//     ]);
//   };

//   return ReactDOM.createPortal(
//     <BaseModal title="Make Payment" isOpen setClose={onClose}>
//       <div className="space-y-4">
//         {/* Payment Method */}
//         <div>
//           <label className="text-sm font-medium text-text">
//             Payment Method
//           </label>
//           <select
//             value={paymentMethod}
//             onChange={(e) =>
//               setPaymentMethod(
//                 e.target.value as InitPaymentRequest["payment_method"]
//               )
//             }
//             className="mt-1 block w-full rounded-lg border border-border bg-surface p-2 text-sm text-text"
//           >
//             <option value="cash">Cash</option>
//             <option value="card">Card</option>
//             <option value="transfer">Transfer</option>
//           </select>
//         </div>

//         {/* Payment Items */}
//         <div className="space-y-2">
//           <label className="text-sm font-medium text-text">Items</label>
//           {items.map((item, index) => (
//             <div
//               key={item.id}
//               className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-surface p-2 rounded-lg border border-border"
//             >
//               <input
//                 type="number"
//                 placeholder="Unit Price"
//                 value={item.unit_price}
//                 onChange={(e) =>
//                   setItems((prev) =>
//                     prev.map((it, i) =>
//                       i === index ? { ...it, unit_price: +e.target.value } : it
//                     )
//                   )
//                 }
//                 className="rounded border border-border p-1 text-sm"
//               />
//               <input
//                 type="number"
//                 placeholder="Units"
//                 value={item.units}
//                 onChange={(e) =>
//                   setItems((prev) =>
//                     prev.map((it, i) =>
//                       i === index ? { ...it, units: +e.target.value } : it
//                     )
//                   )
//                 }
//                 className="rounded border border-border p-1 text-sm"
//               />
//               <input
//                 type="date"
//                 value={item.from.split("T")[0]}
//                 onChange={(e) =>
//                   setItems((prev) =>
//                     prev.map((it, i) =>
//                       i === index
//                         ? {
//                             ...it,
//                             from: new Date(e.target.value).toISOString(),
//                           }
//                         : it
//                     )
//                   )
//                 }
//                 className="rounded border border-border p-1 text-sm"
//               />
//               <input
//                 type="date"
//                 value={item.to.split("T")[0]}
//                 onChange={(e) =>
//                   setItems((prev) =>
//                     prev.map((it, i) =>
//                       i === index
//                         ? { ...it, to: new Date(e.target.value).toISOString() }
//                         : it
//                     )
//                   )
//                 }
//                 className="rounded border border-border p-1 text-sm"
//               />
//             </div>
//           ))}
//           <Button variant="outline" size="sm" onClick={addItem}>
//             + Add Item
//           </Button>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-2 justify-end">
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={handlePay}
//             disabled={isPending}
//           >
//             {isPending ? "Processing..." : "Confirm Payment"}
//           </Button>
//           <Button variant="outline" size="sm" onClick={onClose}>
//             Cancel
//           </Button>
//         </div>
//       </div>
//     </BaseModal>,
//     document.body
//   );
// }
