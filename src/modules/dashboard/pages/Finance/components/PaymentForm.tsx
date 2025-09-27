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
import { toast } from "react-toastify";
import ListingSkeleton from "../../Home/components/ListingSkeleton";

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

  /* -------------------- Items setup -------------------- */
  const initialItems = useMemo<(PaymentItem & { name?: string })[]>(() => {
    const debts =
      debtRes?.data?.map((d: any) => ({
        id: d.item_id,
        name: d.name,
        // coerce to numbers to avoid undefined / string issues
        unit_price: Number(d.item_amount) || 0,
        units: Number(d.periods_owed) || 0,
        from: d.from,
        to: recalcToDate(d.from, Number(d.periods_owed) || 0),
      })) || [];

    // Appreciation always added (optional)
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

  // start empty then set when initialItems ready (avoids rendering stale computed values)
  const [items, setItems] = useState<(PaymentItem & { name?: string })[]>([]);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

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
        (sum, it) =>
          sum + (Number(it.unit_price) || 0) * (Number(it.units) || 0),
        0
      ),
    [items]
  );

  const allChecked = useMemo(
    () =>
      items
        .filter((i) => i.name !== "Appreciation")
        .every((i) => Number(i.units) > 0),
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
              units: checked ? Math.max(1, Number(it.units) || 1) : 0,
              to: recalcToDate(
                it.from,
                checked ? Math.max(1, Number(it.units) || 1) : 0
              ),
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
        it.name === "Appreciation"
          ? { ...it, unit_price: Number(value) || 0 }
          : it
      )
    );
  };

  const handlePay = () => {
    if (!selectedEvent) {
      const msg = "Please select an associated event to continue.";
      setEventError(msg);
      // small toast for the missing required field (used sparingly)
      toast.warn(msg, { toastId: "payment-no-event" });
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
            Number(it.units) > 0 &&
            (it.name !== "Appreciation" || Number(it.unit_price) > 0)
        )
        .map((it) => ({
          id: it.id,
          unit_price: Number(it.unit_price) || 0,
          units: Number(it.units) || 0,
          from: formatDate(it.from),
          to: formatDate(it.to),
        })),
    });
  };

  /* -------------------- Render -------------------- */
  if (loadingDebts)
    return (
      <div className="p-4">
        <ListingSkeleton />
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      {/* Sticky header (mobile only) */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border p-3 flex items-center sm:hidden">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            onClick={onBack}
            className="p-2 rounded-md hover:bg-muted text-accent active:scale-95"
          >
            <FaChevronLeft size={14} />
          </Button>

          <CheckboxField
            field={{
              name: "selectAllMobile",
              value: allChecked,
              onChange: toggleAll,
              onBlur: () => {},
              ref: () => {},
            }}
            label="Select All"
          />
        </div>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Back link (desktop only) */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="hidden sm:flex text-sm text-accent font-medium items-center gap-1 hover:text-accent-hover mb-2"
        >
          <FaChevronLeft size={12} /> Back to members
        </Button>

        {/* Mobile: two-row layout with checkbox */}
        <div className="sm:hidden space-y-3">
          {items.map((item, idx) => {
            const itemTotal =
              (Number(item.unit_price) || 0) * (Number(item.units) || 0);
            const isAppreciation = item.name === "Appreciation";

            return (
              <div
                key={item.id}
                className="border border-border bg-background rounded-md p-3 text-sm"
              >
                {/* Row 1: checkbox + name + unit controls */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {!isAppreciation && (
                      <CheckboxField
                        field={{
                          name: item.name || `item-${item.id}`,
                          value: Number(item.units) > 0,
                          onChange: (checked: boolean) =>
                            updateItemUnits(idx, checked ? 1 : 0),
                          onBlur: () => {},
                          ref: () => {},
                        }}
                        label={item.name ?? "Unnamed"}
                      />
                    )}
                    {isAppreciation && (
                      <span className="font-semibold text-text">
                        {item.name}
                      </span>
                    )}
                  </div>

                  {!isAppreciation && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={Number(item.units) <= 1}
                        onClick={() =>
                          updateItemUnits(
                            idx,
                            Math.max(1, (Number(item.units) || 1) - 1)
                          )
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
                          updateItemUnits(idx, (Number(item.units) || 0) + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  )}
                </div>

                {/* Row 2: price / accumulated */}
                <div className="flex justify-between items-center text-xs text-text-placeholder mt-1">
                  {!isAppreciation ? (
                    <>
                      <span>
                        ₦{(Number(item.unit_price) || 0).toLocaleString()}
                      </span>
                      <span>
                        Accumulated:{" "}
                        <span className="font-bold text-red-500">
                          ₦{itemTotal.toLocaleString()}
                        </span>
                      </span>
                    </>
                  ) : (
                    <FormInput
                      type="number"
                      placeholder="Enter amount"
                      value={item.unit_price ?? ""}
                      onChange={(e) =>
                        updateAppreciationAmount(+e.target.value)
                      }
                      className="w-full text-right"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: table layout (with select-all checkbox in header) */}
        <div className="hidden sm:block">
          <table className="w-full border border-border text-sm bg-background">
            <thead className="bg-muted text-left">
              <tr>
                <th className="p-2 text-text">
                  <div className="flex items-center gap-2">
                    <CheckboxField
                      field={{
                        name: "selectAllDesktop",
                        value: allChecked,
                        onChange: toggleAll,
                        onBlur: () => {},
                        ref: () => {},
                      }}
                      label=""
                    />
                    <span className="font-semibold">Item</span>
                  </div>
                </th>
                <th className="p-2 text-text">Price</th>
                <th className="p-2 text-text">Units</th>
                <th className="p-2 text-text">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const itemTotal =
                  (Number(item.unit_price) || 0) * (Number(item.units) || 0);
                const isAppreciation = item.name === "Appreciation";

                return (
                  <tr
                    key={item.id}
                    className="border-t border-border hover:bg-muted/40"
                  >
                    <td className="p-2 text-text-secondary">
                      {!isAppreciation ? (
                        <CheckboxField
                          field={{
                            name: item.name || `item-${item.id}`,
                            value: Number(item.units) > 0,
                            onChange: (checked: boolean) =>
                              updateItemUnits(idx, checked ? 1 : 0),
                            onBlur: () => {},
                            ref: () => {},
                          }}
                          label={item.name ?? "Unnamed"}
                        />
                      ) : (
                        <span className="font-semibold text-text">
                          {item.name}
                        </span>
                      )}
                    </td>

                    <td className="p-2 text-text-secondary">
                      {isAppreciation ? (
                        <FormInput
                          type="number"
                          placeholder="0"
                          value={item.unit_price ?? ""}
                          onChange={(e) =>
                            updateAppreciationAmount(+e.target.value)
                          }
                          className="w-20 text-right"
                        />
                      ) : (
                        <span>
                          ₦{(Number(item.unit_price) || 0).toLocaleString()}
                        </span>
                      )}
                    </td>

                    <td className="p-2 text-text-secondary">
                      {!isAppreciation ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={Number(item.units) <= 1}
                            onClick={() =>
                              updateItemUnits(
                                idx,
                                Math.max(1, (Number(item.units) || 1) - 1)
                              )
                            }
                          >
                            -
                          </Button>
                          <span className="w-6 text-center font-medium">
                            {item.units}
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              updateItemUnits(
                                idx,
                                (Number(item.units) || 0) + 1
                              )
                            }
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="p-2 font-bold text-accent">
                      ₦{itemTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bg-surface bottom-0 border-t border-border p-3 space-y-2">
        {/* Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Dropdown
            label="Event"
            items={events}
            displayValueKey="name"
            value={selectedEvent}
            isError={!!eventError}
            errorMsg={eventError ?? undefined}
            onSelect={(item) => {
              setSelectedEvent(item);
              setEventError(null);
            }}
            placeholder={loadingEvents ? "Loading..." : "Select event"}
            disabled={loadingEvents}
            className="flex-1"
            size="small"
          />

          <Dropdown
            label="Payment"
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
            size="small"
          />
        </div>

        {/* Pay Button */}
        <Button
          variant="primary"
          size="md"
          onClick={handlePay}
          disabled={isPending || totalAmount <= 0}
          className="w-full sm:w-auto py-2"
        >
          {isPending ? "Processing..." : `Pay ₦${totalAmount.toLocaleString()}`}
        </Button>
      </div>
    </div>
  );
}
