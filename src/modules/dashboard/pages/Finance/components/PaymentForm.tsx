import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { Dropdown } from "../../../../../components/ui/Dropdown";
import { CheckboxField } from "../../../../../components/ui/CheckBoxField";
import { Button } from "../../../../../components/ui/Button";
import FormInput from "../../../../../components/ui/FormInput";
import { formatDate } from "../../../utils/Helper";
import { fetchAllEvents } from "../../../services/events";
import { useFetchDebts } from "../../../hook/useFinance";
import type { InitPaymentRequest, PaymentItem } from "../../../types";

/* -------------------- Helpers -------------------- */
function recalcToDate(from: string, units: number) {
  const start = new Date(from);
  const end = new Date(start);
  end.setMonth(start.getMonth() + (units > 0 ? units - 1 : 0));
  return end.toISOString();
}

/* -------------------- Component -------------------- */
export function PaymentForm({
  selectedUser,
  onBack,
  onPay,
  isPending,
}: {
  selectedUser: any;
  onBack: () => void;
  onPay: (payload: InitPaymentRequest) => void;
  isPending: boolean;
}) {
  const [paymentMethod, setPaymentMethod] =
    useState<InitPaymentRequest["payment_method"]>("cash");
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);

  const { data: debtRes, isLoading: loadingDebts } = useFetchDebts(
    selectedUser?.id
  );

  // build items list
  const initialItems = useMemo<(PaymentItem & { name?: string })[]>(() => {
    const debts =
      debtRes?.data?.map((d: any) => ({
        id: d.item_id,
        name: d.name,
        unit_price: d.item_amount ?? 0,
        units: d.periods_owed ?? 0,
        from: d.from,
        to: recalcToDate(d.from, d.periods_owed ?? 0),
      })) || [];

    debts.push({
      id: 999,
      name: "Appreciation",
      unit_price: 0,
      units: 1,
      from: new Date().toISOString(),
      to: new Date().toISOString(),
    });

    return debts;
  }, [debtRes]);

  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    if (debtRes?.data) setItems(initialItems);
  }, [debtRes, initialItems]);

  /* -------------------- Data Fetching -------------------- */
  useEffect(() => {
    const loadEvents = async () => {
      setLoadingEvents(true);
      try {
        const { data } = await fetchAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    loadEvents();
  }, []);

  /* -------------------- Derived State -------------------- */
  const totalAmount = useMemo(
    () =>
      items.reduce(
        (sum, it) => sum + (it.unit_price ?? 0) * (it.units ?? 0),
        0
      ),
    [items]
  );

  const allChecked = useMemo(
    () =>
      items.filter((i) => i.name !== "Appreciation").every((i) => i.units > 0),
    [items]
  );

  /* -------------------- Handlers -------------------- */
  const toggleAll = (checked: boolean) => {
    setItems((prev) =>
      prev.map((it) =>
        it.name === "Appreciation"
          ? it
          : {
              ...it,
              units: checked ? Math.max(1, it.units) : 0,
              to: recalcToDate(it.from, checked ? Math.max(1, it.units) : 0),
            }
      )
    );
  };

  const updateItemUnits = (index: number, newUnits: number) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === index
          ? { ...it, units: newUnits, to: recalcToDate(it.from, newUnits) }
          : it
      )
    );
  };

  const updateAppreciationAmount = (value: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.name === "Appreciation" ? { ...it, unit_price: value } : it
      )
    );
  };

  const handlePay = () => {
    if (!selectedEvent) {
      setEventError("Please select an associated event to continue.");
      return;
    }
    setEventError(null);

    onPay({
      user_id: selectedUser.id,
      event_id: selectedEvent.id,
      payment_method: paymentMethod,
      items: items
        .filter(
          (it) =>
            it.units > 0 && (it.name !== "Appreciation" || it.unit_price > 0)
        )
        .map((it) => ({
          id: it.id,
          unit_price: it.unit_price ?? 0,
          units: it.units,
          from: formatDate(it.from),
          to: formatDate(it.to),
        })),
    });
  };

  /* -------------------- Render -------------------- */
  if (loadingDebts) return <div className="p-4">Loading debts...</div>;

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header mobile */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border p-3 flex items-center sm:hidden">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            onClick={onBack}
            className="p-2 rounded-md hover:bg-muted text-accent active:scale-95"
          >
            <FaChevronLeft size={14} />
          </Button>
          <span className="font-semibold text-accent ml-1">Payment</span>
          <CheckboxField
            field={{
              name: "selectAllMobile",
              value: allChecked,
              onChange: toggleAll,
              onBlur: () => {},
              ref: () => {},
            }}
            label="Select all"
          />
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="hidden sm:flex text-sm text-accent font-medium items-center gap-1 hover:text-accent-hover"
        >
          <FaChevronLeft size={12} /> Back to members
        </Button>

        {/* Items */}
        <div className="space-y-3">
          {items.map((item, idx) => {
            const itemTotal = (item.unit_price ?? 0) * (item.units ?? 0);
            const isAppreciation = item.name === "Appreciation";

            return (
              <div
                key={item.id}
                className="border border-border bg-background rounded-lg p-4 flex flex-col gap-3 sm:grid sm:grid-cols-5 sm:items-center sm:gap-4"
              >
                {/* Name */}
                <div className="flex items-center gap-2 col-span-2">
                  {!isAppreciation ? (
                    <CheckboxField
                      field={{
                        name: item.name || `item-${item.id}`,
                        value: item.units > 0,
                        onChange: (checked: boolean) =>
                          updateItemUnits(idx, checked ? 1 : 0),
                        onBlur: () => {},
                        ref: () => {},
                      }}
                      label={item.name ?? "Unnamed"}
                    />
                  ) : (
                    <span className="font-semibold text-text">{item.name}</span>
                  )}
                </div>

                {/* Price */}
                <div className="flex justify-between sm:justify-end items-center">
                  {isAppreciation ? (
                    <FormInput
                      type="number"
                      placeholder="0"
                      value={item.unit_price ?? ""}
                      onChange={(e) =>
                        updateAppreciationAmount(+e.target.value)
                      }
                      className="w-full ml-2 sm:w-28 text-right"
                    />
                  ) : (
                    <span className="font-medium text-text">
                      ₦{(item.unit_price ?? 0).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Units */}
                {!isAppreciation && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={item.units <= 1}
                      onClick={() =>
                        updateItemUnits(idx, Math.max(1, (item.units ?? 1) - 1))
                      }
                    >
                      -
                    </Button>
                    <span className="w-6 text-center font-medium text-text">
                      {item.units}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        updateItemUnits(idx, (item.units ?? 0) + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-end items-center">
                  <span className="font-bold text-accent">
                    ₦{itemTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with dropdowns and pay */}
      <div className="sticky bottom-0 bg-surface border-t border-border p-4 space-y-3 sm:space-y-0 sm:flex sm:flex-col sm:gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <Dropdown
            label="Associated Event"
            items={events}
            displayValueKey="name"
            value={selectedEvent}
            isError={!!eventError}
            errorMsg={eventError!}
            onSelect={(item) => {
              setSelectedEvent(item);
              setEventError(null);
            }}
            placeholder={loadingEvents ? "Loading events..." : "Select event"}
            disabled={loadingEvents}
            className="flex-1"
          />
          <Dropdown
            label="Payment Method"
            items={[
              { id: "cash", name: "Cash" },
              { id: "online", name: "Online (Coming Soon)", disabled: true },
            ]}
            displayValueKey="name"
            value={
              [{ id: "cash", name: "Cash" }].find(
                (m) => m.id === paymentMethod
              ) || null
            }
            onSelect={(item) =>
              !item?.disabled &&
              setPaymentMethod(
                (item?.id as InitPaymentRequest["payment_method"]) || "cash"
              )
            }
            placeholder="Choose method"
            className="flex-1"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-lg sm:text-xl font-bold text-text">
            Grand Total: ₦{totalAmount.toLocaleString()}
          </span>
          <Button
            variant="primary"
            size="lg"
            onClick={handlePay}
            disabled={isPending || totalAmount <= 0}
            className="w-full sm:w-auto"
          >
            {isPending
              ? "Processing..."
              : `Pay ₦${totalAmount.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
