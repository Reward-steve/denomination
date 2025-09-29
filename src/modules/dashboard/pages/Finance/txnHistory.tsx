import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { TbTransactionDollar } from "react-icons/tb";
import { IoIosSearch } from "react-icons/io";
import { FaSlidersH } from "react-icons/fa";

import DashboardLayout from "../../components/Layout";
import { useAuth } from "../../../../hooks/useAuth";
import {
  fetchUserTransactions,
  fetchAllTransactions,
} from "../../services/finance";

import { Dropdown } from "../../../../components/ui/Dropdown";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { BaseModal } from "../../../../components/ui/BaseModal";
import FormInput from "../../../../components/ui/FormInput";
import { Button } from "../../../../components/ui/Button";
import { DashboardHeader } from "../../components/Header";
import {
  DateFormInput,
  ReceiptContent,
  TransactionList,
  TransactionListSkeleton,
  type Transaction,
  type TransactionStatus,
} from "./components/FinanceCom";

interface DropdownOption {
  id: string | number;
  name: string;
}

export const MapApiToTransactions = (apiData: any[] = []): Transaction[] =>
  apiData.map((txn) => ({
    id: Number(txn?.id) || 0,
    status: (txn?.status as TransactionStatus) || "pending",
    username:
      [txn?.first_name, txn?.last_name].filter(Boolean).join(" ") ||
      txn?.username ||
      "Unknown",
    amount: Number(txn?.amount) || 0,
    date: txn?.created_at ? txn.created_at.split(" ")[0] : undefined,
    payment_method: txn?.payment_method ?? null,
    payment_gateway: txn?.payment_gateway ?? null,
    event_id: txn?.event_id ?? null,
    event_name: txn?.event_name ?? null,
    reference: txn?.reference ?? null,
    descr: txn?.descr ?? null,
    recurring: Number(txn?.recurring) || 0,
    created_at: txn?.created_at ?? null,
    updated_at: txn?.updated_at ?? null,
    from_date: txn?.from_date ?? null,
    to_date: txn?.to_date ?? null,
    item_name: txn?.item_name ?? null,
  }));

/* Constants */
const STATUS_OPTIONS: DropdownOption[] = [
  { id: "all", name: "All" },
  { id: "successful", name: "Successful" },
  { id: "pending", name: "Pending" },
  { id: "failed", name: "Failed" },
];

const PAYMENT_METHOD_OPTIONS: DropdownOption[] = [
  { id: "all", name: "All" },
  { id: "cash", name: "Cash" },
  { id: "card", name: "Card" },
  { id: "transfer", name: "Transfer" },
  { id: "mobile", name: "Mobile" },
];

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS: DropdownOption[] = Array.from({ length: 6 }).map((_, i) => {
  const y = String(currentYear + i);
  return { id: y, name: y };
});

const MONTH_OPTIONS: DropdownOption[] = moment.months().map((m, i) => ({
  id: String(i + 1).padStart(2, "0"),
  name: m,
}));

/* Filter modal */
interface FilterModalProps {
  setClose: () => void;
  filters: {
    filterStatus: DropdownOption;
    filterPaymentMethod: DropdownOption;
    filterYear: DropdownOption | null;
    filterMonth: DropdownOption | null;
    filterDate: string;
  };
  setFilters: (key: string, value: any) => void;
  onApply: () => void;
  onReset: () => void;
  loading: boolean;
}

const FilterModal: FC<FilterModalProps> = ({
  setClose,
  filters,
  setFilters,
  onApply,
  onReset,
  loading,
}) => {
  return (
    <BaseModal title="Advanced Filters" setClose={setClose} size="md">
      <div className="p-4 sm:p-6 space-y-4 bg-background">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Dropdown<DropdownOption>
            label="Status"
            items={STATUS_OPTIONS}
            displayValueKey="name"
            value={filters.filterStatus}
            onSelect={(v) => v && setFilters("filterStatus", v)}
          />
          <Dropdown<DropdownOption>
            label="Payment Method"
            items={PAYMENT_METHOD_OPTIONS}
            displayValueKey="name"
            value={filters.filterPaymentMethod}
            onSelect={(v) => v && setFilters("filterPaymentMethod", v)}
          />
          <Dropdown<DropdownOption>
            label="Year"
            items={YEAR_OPTIONS}
            displayValueKey="name"
            value={filters.filterYear}
            onSelect={(v) => v && setFilters("filterYear", v)}
          />
          <Dropdown<DropdownOption>
            label="Month"
            items={MONTH_OPTIONS}
            displayValueKey="name"
            value={filters.filterMonth}
            onSelect={(v) => setFilters("filterMonth", v)}
            optional
          />
          <div className="col-span-1 sm:col-span-2">
            <DateFormInput
              label="Specific Date"
              value={filters.filterDate}
              onChange={(value) => setFilters("filterDate", value)}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex flex-col gap-3 md:flex-row md:justify-end">
            <Button
              onClick={() => {
                onReset();
                setClose();
              }}
              disabled={loading}
              variant="outline"
              className="w-full md:w-auto"
            >
              Reset All
            </Button>

            <Button
              onClick={() => {
                onApply();
                setClose();
              }}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Applying..." : "Apply Filters"}
            </Button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

/* Main component */
export default function TransactionHistory() {
  const { user } = useAuth();
  const loc = useLocation();

  const searchParams = new URLSearchParams(loc.search);
  const fromFinance = !!searchParams.get("fromfinance");
  const isAdmin = Boolean(user?.is_admin && fromFinance) || false;

  const [filterStatus, setFilterStatus] = useState<DropdownOption>(
    STATUS_OPTIONS[0]
  );
  const [filterPaymentMethod, setFilterPaymentMethod] =
    useState<DropdownOption>(PAYMENT_METHOD_OPTIONS[0]);
  const [filterYear, setFilterYear] = useState<DropdownOption | null>(
    YEAR_OPTIONS[0]
  );
  const [filterMonth, setFilterMonth] = useState<DropdownOption | null>(null);
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterSearch, setFilterSearch] = useState<string>("");

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [txDetails, setTxDetails] = useState<Transaction | undefined>(
    undefined
  );

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [masterTransactions, setMasterTransactions] = useState<Transaction[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const setFilterValue = useCallback((key: string, value: any) => {
    switch (key) {
      case "filterStatus":
        setFilterStatus(value);
        break;
      case "filterPaymentMethod":
        setFilterPaymentMethod(value);
        break;
      case "filterYear":
        setFilterYear(value);
        break;
      case "filterMonth":
        setFilterMonth(value);
        break;
      case "filterDate":
        setFilterDate(value);
        break;
      case "filterSearch":
        setFilterSearch(value);
        break;
      default:
        break;
    }
  }, []);

  const buildApiFilters = useCallback(() => {
    const out: Record<string, string> = {};
    if (filterStatus?.id && String(filterStatus.id) !== "all")
      out.status = String(filterStatus.id);
    if (filterPaymentMethod?.id && String(filterPaymentMethod.id) !== "all")
      out.payment_method = String(filterPaymentMethod.id);
    if (filterYear?.id) out.year = String(filterYear.id);
    if (filterMonth?.id) out.month = String(filterMonth.id).padStart(2, "0");
    if (filterDate) out.date = filterDate;
    if (filterSearch && filterSearch.trim() !== "")
      out.search = filterSearch.trim();
    return out;
  }, [
    filterStatus,
    filterPaymentMethod,
    filterYear,
    filterMonth,
    filterDate,
    filterSearch,
  ]);

  const applyClientSideFilter = useCallback(
    (items: Transaction[], filters: ReturnType<typeof buildApiFilters>) => {
      return items.filter((t) => {
        if (filters.status && t.status !== filters.status) return false;
        if (
          filters.payment_method &&
          t.payment_method !== filters.payment_method
        )
          return false;

        const createdDate = t.created_at ? new Date(t.created_at) : null;
        if (createdDate) {
          if (
            filters.year &&
            createdDate.getFullYear().toString() !== filters.year
          )
            return false;
          if (filters.month) {
            const createdMonth = String(createdDate.getMonth() + 1).padStart(
              2,
              "0"
            );
            if (createdMonth !== filters.month) return false;
          }
          if (filters.date) {
            const createdDay = moment(createdDate).format("YYYY-MM-DD");
            if (createdDay !== filters.date) return false;
          }
        }

        if (filters.search) {
          const s = filters.search.toLowerCase();
          const name = (t.username || "").toLowerCase();
          const ref = (t.reference || "").toLowerCase();
          const itemName = (t.item_name || "").toLowerCase();
          const eventName = (t.event_name || "").toLowerCase();

          if (
            !name.includes(s) &&
            !ref.includes(s) &&
            !itemName.includes(s) &&
            !eventName.includes(s)
          )
            return false;
        }

        return true;
      });
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    const loadInitial = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await (isAdmin
          ? fetchAllTransactions({})
          : fetchUserTransactions(false));

        const mapped = MapApiToTransactions(res?.data || []);

        if (!mounted) return;

        if (isAdmin) {
          setTransactions(mapped);
        } else {
          setMasterTransactions(mapped);
          setTransactions(mapped);
        }
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadInitial();
    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const applyFilters = useCallback(async () => {
    setLoading(true);
    setError(false);
    const filtersToSend = buildApiFilters();

    try {
      if (isAdmin) {
        const res = await fetchAllTransactions(filtersToSend);
        setTransactions(MapApiToTransactions(res?.data || []));
      } else {
        const filtered = applyClientSideFilter(
          masterTransactions,
          filtersToSend
        );
        setTransactions(filtered);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, buildApiFilters, applyClientSideFilter, masterTransactions]);

  const resetFilters = useCallback(() => {
    setFilterStatus(STATUS_OPTIONS[0]);
    setFilterPaymentMethod(PAYMENT_METHOD_OPTIONS[0]);
    setFilterYear(YEAR_OPTIONS[0]);
    setFilterMonth(null);
    setFilterDate("");
    setFilterSearch("");

    if (isAdmin) {
      applyFilters(); // refetch from API
    } else {
      setTransactions(masterTransactions); // restore from cache
    }
  }, [isAdmin, masterTransactions, applyFilters]);

  const filterProps = useMemo(
    () => ({
      filterStatus,
      filterPaymentMethod,
      filterYear,
      filterMonth,
      filterDate,
    }),
    [filterStatus, filterPaymentMethod, filterYear, filterMonth, filterDate]
  );

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Transactions History"
        description="view all transactions"
      >
        <div className="sticky top-0 bg-background pb-4 z-10 border-b border-border/50 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:max-w-xs">
              <FormInput
                id="search-filter"
                placeholder="Search by Username, Reference, or Item"
                value={filterSearch}
                onChange={(e) => setFilterValue("filterSearch", e.target.value)}
                icon={IoIosSearch}
              />
            </div>

            <div className="flex w-full flex-row gap-3 md:w-auto md:flex-row md:items-center">
              <Button
                onClick={() => setShowFiltersModal(true)}
                variant="outline"
                className="flex-1 justify-center md:flex-none"
              >
                <FaSlidersH className="h-5 w-5 text-accent" />
                <span className="ml-2">Filters</span>
              </Button>

              {/* Apply Button */}
              <Button
                onClick={applyFilters}
                disabled={loading}
                variant="primary"
                className="flex-1 justify-center md:flex-none"
              >
                {loading ? <span className="animate-spin">⚙️</span> : "Apply"}
              </Button>
            </div>
          </div>
        </div>

        <section className="space-y-8 animate-fade mt-4">
          {loading ? (
            <TransactionListSkeleton />
          ) : error ? (
            <p className="text-center text-error py-8">
              Failed to load transactions. Please try again.
            </p>
          ) : transactions.length ? (
            <TransactionList
              transactions={transactions}
              onSelect={(t) => {
                setTxDetails(t);
                setShowReceipt(true);
              }}
            />
          ) : (
            <EmptyState
              title="No Transactions Found"
              description="Try changing your filter criteria or resetting them."
              icon={<TbTransactionDollar className="w-8 h-8 text-accent" />}
            />
          )}
        </section>
      </DashboardHeader>

      {showFiltersModal && (
        <FilterModal
          setClose={() => setShowFiltersModal(false)}
          filters={filterProps}
          setFilters={setFilterValue}
          onApply={applyFilters}
          onReset={resetFilters}
          loading={loading}
        />
      )}

      {showReceipt && txDetails && (
        <BaseModal
          title="Transaction Receipt"
          setClose={() => setShowReceipt(false)}
        >
          <ReceiptContent txDetails={txDetails} />
        </BaseModal>
      )}
    </DashboardLayout>
  );
}
