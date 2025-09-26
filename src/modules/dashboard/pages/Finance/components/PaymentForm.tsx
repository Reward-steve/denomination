import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { Dropdown } from "../../../../../components/ui/Dropdown";
import { CheckboxField } from "../../../../../components/ui/CheckBoxField";
import { Button } from "../../../../../components/ui/Button";
import FormInput from "../../../../../components/ui/FormInput";
import { formatDate } from "../../../utils/Helper";
import { fetchAllEvents } from "../../../services/events";
import type { InitPaymentRequest, PaymentItem } from "../../../types";

/* -------------------- Types -------------------- */
interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  primary_phone: string;
  photo?: string;
}

interface Event {
  id: number;
  name: string;
}

/* -------------------- Constants -------------------- */
const paymentMethods = [
  { id: "cash", name: "Cash" },
  { id: "card", name: "Card" },
  { id: "transfer", name: "Transfer" },
];

const defaultPaymentItems: (PaymentItem & { name?: string })[] = [
  {
    id: 1,
    name: "Dues",
    unit_price: 200,
    units: 1,
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Welfare",
    unit_price: 500,
    units: 0,
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Registration Fee",
    unit_price: 2500,
    units: 0,
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Appreciation",
    unit_price: 0,
    units: 1,
    from: new Date().toISOString(),
    to: new Date().toISOString(),
  },
];

/* -------------------- Component -------------------- */
export function PaymentForm({
  selectedUser,
  onBack,
  onPay,
  isPending,
}: {
  selectedUser: User;
  onBack: () => void;
  onPay: (payload: InitPaymentRequest) => void;
  isPending: boolean;
}) {
  const [paymentMethod, setPaymentMethod] =
    useState<InitPaymentRequest["payment_method"]>("card");
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [items, setItems] = useState(defaultPaymentItems);

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
    () => items.reduce((sum, it) => sum + it.unit_price * it.units, 0),
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
        it.name === "Appreciation" ? it : { ...it, units: checked ? 1 : 0 }
      )
    );
  };

  const updateItemUnits = (index: number, newUnits: number) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, units: newUnits } : it))
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
      alert("Please select an associated event first.");
      return;
    }

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
          unit_price: it.unit_price,
          units: it.units,
          from: formatDate(it.from),
          to: formatDate(it.to),
        })),
    });
  };

  /* -------------------- Render -------------------- */
  return (
    <div className="flex flex-col h-full">
      {/* Mobile Sticky Header */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border p-3 flex items-center sm:hidden">
        <div className="flex items-center justify-between w-full">
          <div>
            <Button
              variant="outline"
              onClick={onBack}
              className="p-2 rounded-md hover:bg-muted text-accent active:scale-95"
            >
              <FaChevronLeft size={14} />
            </Button>
            <span className="font-semibold text-accent ml-1">Payment</span>
          </div>
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

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Back link for desktop */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="hidden sm:flex text-sm text-accent font-medium items-center gap-1 hover:text-accent-hover"
        >
          <FaChevronLeft size={12} /> Back to members
        </Button>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:items-end">
          {/* Event Selector */}
          <Dropdown
            label="Associated Event"
            items={events}
            displayValueKey="name"
            value={selectedEvent}
            onSelect={(item) => setSelectedEvent(item as Event)}
            placeholder={
              loadingEvents ? "Loading events..." : "Select an event"
            }
            disabled={loadingEvents}
            className="w-full sm:w-64"
          />

          {/* Payment Method Selector */}
          <Dropdown
            label="Payment Method"
            items={paymentMethods}
            displayValueKey="name"
            value={paymentMethods.find((m) => m.id === paymentMethod) || null}
            onSelect={(item) =>
              setPaymentMethod(
                (item?.id as InitPaymentRequest["payment_method"]) || "card"
              )
            }
            placeholder="Choose payment method"
            className="w-full sm:w-48"
          />
        </div>

        {/* Payment Items */}
        <div className="space-y-3">
          {/* Desktop Headers */}
          <div className="hidden sm:grid sm:grid-cols-5 font-semibold text-sm text-text-secondary px-4 py-2">
            <div className="flex items-center gap-2 col-span-2">
              <CheckboxField
                field={{
                  name: "selectAllDesktop",
                  value: allChecked,
                  onChange: toggleAll,
                  onBlur: () => {},
                  ref: () => {},
                }}
                label="Item"
              />
            </div>
            <div className="flex justify-end">Price</div>
            <div className="flex justify-center">Units</div>
            <div className="flex justify-end">Total</div>
          </div>

          {/* Items List */}
          {items.map((item, idx) => {
            const itemTotal = item.unit_price * item.units;
            const isAppreciation = item.name === "Appreciation";

            return (
              <div
                key={item.id}
                className="border border-border bg-background rounded-lg p-4 flex flex-col gap-3 sm:grid sm:grid-cols-5 sm:items-center sm:gap-4"
              >
                {/* Item Name / Checkbox */}
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
                      label={`${item.name}`}
                    />
                  ) : (
                    <span className="font-semibold text-text">{item.name}</span>
                  )}
                </div>

                {/* Price */}
                <div className="flex justify-between sm:justify-end items-center">
                  <span className="sm:hidden text-xs text-text-secondary">
                    Price:
                  </span>
                  {isAppreciation ? (
                    <FormInput
                      type="number"
                      placeholder="0"
                      value={item.unit_price || ""}
                      onChange={(e) =>
                        updateAppreciationAmount(+e.target.value)
                      }
                      className="w-full ml-2 sm:w-28 text-right"
                    />
                  ) : (
                    <span className="font-medium text-text">
                      ₦{item.unit_price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Units */}
                {!isAppreciation && (
                  <div className="flex justify-between sm:justify-center items-center gap-2">
                    <span className="sm:hidden text-xs text-text-secondary">
                      Units:
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={item.units <= 1}
                        onClick={() =>
                          updateItemUnits(idx, Math.max(1, item.units - 1))
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
                        onClick={() => updateItemUnits(idx, item.units + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="flex justify-between sm:justify-end items-center">
                  <span className="sm:hidden text-xs text-text-secondary">
                    Total:
                  </span>
                  <span className="font-bold text-accent">
                    ₦{itemTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-surface border-t border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-lg sm:text-xl font-bold text-text">
          Grand Total: ₦{totalAmount.toLocaleString()}
        </span>
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          onClick={handlePay}
          disabled={isPending || totalAmount <= 0 || !selectedEvent}
        >
          {isPending ? "Processing..." : `Pay ₦${totalAmount.toLocaleString()}`}
        </Button>
      </div>
    </div>
  );
}
