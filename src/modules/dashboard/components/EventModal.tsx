import { FaX, FaCalendarDays, FaRepeat } from "react-icons/fa6";
import { Button } from "../../../components/ui/Button";
import { CheckboxField } from "../../../components/ui/CheckBoxField";
import { Dropdown } from "../../../components/ui/Dropdown";
import {
  scheduleOptions,
  dayOptions,
  type EventModalProps,
  type Event,
} from "../types";
import { useForm, Controller, useWatch } from "react-hook-form";
import FormInput from "../../../components/ui/FormInput";
import {
  getNthWeekday,
  getWeekdayName,
  getOrdinalSuffix,
} from "../utils/Helper";

/**
 * EventModal (refactored & typesafe)
 *
 * Requirements addressed:
 * - dynamic monthly inputs (dateOfMonth OR nth + weekday)
 * - preview generation (daily/weekly/monthly/yearly)
 * - payload normalization for backend:
 *    time -> "HH:MM:SS"
 *    schedule.day -> "3rd Sunday" or "15" or "Monday"
 *    schedule.month -> numeric month only for yearly
 *
 * Notes:
 * - parent should provide a non-null `newEvent` (emptyEvent default)
 * - Form uses Event as form data shape; schedule subfields are optional
 */

export const EventModal = ({
  modalRef,
  handleModalClick,
  newEvent,
  setNewEvent,
  handleAddEvent,
  setShowModal,
}: EventModalProps) => {
  // Ensure the form receives a full object for default values
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<Event>({
    defaultValues: newEvent as Event, // parent should ensure this is safe
  });

  // watchers
  const recurrent = useWatch({ control, name: "recurrent" }) as
    | boolean
    | undefined;
  const period = useWatch({ control, name: "schedule.period" }) as
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | undefined;
  const selectedDay = useWatch({ control, name: "schedule.day" }) as
    | string
    | undefined;
  const dateOfMonth = useWatch({ control, name: "schedule.dateOfMonth" }) as
    | number
    | undefined;
  const nth = useWatch({ control, name: "schedule.nth" }) as
    | "1st"
    | "2nd"
    | "3rd"
    | "4th"
    | "5th"
    | "last"
    | undefined;
  const weekday = useWatch({ control, name: "schedule.weekday" }) as
    | string
    | undefined;
  const date = watch("date") as string | undefined; // "YYYY-MM-DD"

  // Build recurring preview safely
  const getRecurringPreview = (): string | null => {
    if (!recurrent || !period || !date) return null;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null;
    const weekdayName = getWeekdayName(parsedDate);

    switch (period) {
      case "daily":
        // using time if available
        return `Every day at ${parsedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;

      case "weekly":
        return `Every ${selectedDay || weekdayName}`;

      case "monthly": {
        if (typeof dateOfMonth === "number" && !Number.isNaN(dateOfMonth)) {
          return `Every ${getOrdinalSuffix(dateOfMonth)} of each month`;
        }
        if (nth && weekday) {
          // nth expected to be "1st"|"2nd"|"3rd"|"4th"|"last"
          return `Every ${nth} ${weekday} of each month`;
        }
        // If nothing selected, try to infer nth from the chosen date
        const nthFromDate = getNthWeekday(parsedDate); // "3rd Sunday"
        return `Every ${nthFromDate}`;
      }

      case "yearly":
        return `Every ${parsedDate.toLocaleDateString([], {
          month: "long",
          day: "numeric",
        })}`;

      default:
        return null;
    }
  };

  // Normalize and submit payload (shape expected by backend)
  const onSubmit = (data: Event) => {
    // Guard: ensure date/time exist and are valid
    if (!data.date || !data.time) {
      // Could show UI error instead; here we just abort safe
      return;
    }

    const parsedDate = new Date(data.date);
    const normalizedTime =
      data.time.length === 5 ? `${data.time}:00` : data.time;

    // Build schedule.day according to selected monthly/weekly/yearly options
    let scheduleForPayload:
      | {
          period: "daily" | "weekly" | "monthly" | "yearly" | undefined;
          day?: string | undefined;
          month?: number | undefined;
        }
      | undefined = undefined;

    if (data.recurrent) {
      const periodVal = data.schedule?.period;
      // weekly: schedule.day should be "Monday" etc (use selectedDay or schedule.day)
      if (periodVal === "weekly") {
        scheduleForPayload = {
          period: "weekly",
          day: (data.schedule?.day || selectedDay) as string | undefined,
        };
      } else if (periodVal === "monthly") {
        // prefer explicit dateOfMonth -> numeric day string "15"
        const dateOfMonthVal = data.schedule?.dateOfMonth ?? dateOfMonth;
        if (
          typeof dateOfMonthVal === "number" &&
          !Number.isNaN(dateOfMonthVal)
        ) {
          scheduleForPayload = {
            period: "monthly",
            day: String(dateOfMonthVal),
          };
        } else {
          // use nth + weekday if provided (e.g. "3rd Sunday")
          const nthVal = data.schedule?.nth ?? nth;
          const weekdayVal = data.schedule?.weekday ?? weekday;
          if (nthVal && weekdayVal) {
            scheduleForPayload = {
              period: "monthly",
              day: `${nthVal} ${weekdayVal}`,
            };
          } else {
            // fallback: infer from chosen date
            scheduleForPayload = {
              period: "monthly",
              day: getNthWeekday(parsedDate), // already returns "3rd Sunday" style
            };
          }
        }
      } else if (periodVal === "yearly") {
        // yearly: day should be numeric day string; month should be numeric 1-12
        const dayVal = data.schedule?.day ?? String(parsedDate.getDate());
        const monthVal = parsedDate.getMonth() + 1;
        scheduleForPayload = { period: "yearly", day: dayVal, month: monthVal };
      } else if (periodVal === "daily") {
        scheduleForPayload = { period: "daily" };
      } else {
        // if no period selected yet, leave undefined (validation should prevent submit)
        scheduleForPayload = undefined;
      }
    }

    const payload: Event = {
      ...data,
      time: normalizedTime,
      schedule: scheduleForPayload as Event["schedule"] | undefined,
    };

    // Pass to parent
    setNewEvent(payload);
    handleAddEvent();
    setShowModal(false);
  };

  // Render
  return (
    <div
      ref={modalRef}
      onClick={handleModalClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
          <h2 className="text-xl font-semibold text-text">
            {newEvent.id ? "Edit Event" : "Add New Event"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 rounded-full hover:bg-background/70 transition-colors"
          >
            <FaX size={16} className="text-primary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="border rounded-lg p-4 border-border space-y-4">
            <h3 className="font-medium text-text mb-2">Basic Info</h3>

            <FormInput
              id="name"
              label="Event Name"
              placeholder="Event Name"
              register={register("name", {
                required: "Event name is required",
              })}
              error={errors.name}
            />

            <FormInput
              id="venue"
              label="Venue"
              placeholder="Event Venue"
              register={register("venue", { required: "Venue is required" })}
              error={errors.venue}
            />

            <FormInput
              id="descr"
              label="Description"
              placeholder="Optional description"
              register={register("descr")}
              error={errors.descr}
              optional
            />
          </div>

          {/* Date & Time */}
          <div className="border rounded-lg p-4 border-border space-y-4">
            <h3 className="font-medium text-text mb-2">Date & Time</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <FormInput
                id="date"
                type="date"
                label="Date"
                register={register("date", { required: "Date is required" })}
                error={errors.date}
                icon={FaCalendarDays}
              />
              <FormInput
                id="time"
                type="time"
                label="Time"
                register={register("time", { required: "Time is required" })}
                error={errors.time}
              />
            </div>
          </div>

          {/* Recurring */}
          <div className="border rounded-lg p-4 border-border space-y-4">
            <h3 className="font-medium text-text mb-2">Recurring</h3>

            <Controller
              control={control}
              name="recurrent"
              render={({ field }) => (
                <CheckboxField field={field} label="Enable Recurring" />
              )}
            />

            {recurrent && (
              <div className="space-y-3">
                {/* Period */}
                <Controller
                  name="schedule.period"
                  control={control}
                  rules={{ required: "Schedule period is required" }}
                  render={({ field }) => (
                    <Dropdown
                      label="Schedule"
                      placeholder="Select schedule"
                      items={scheduleOptions}
                      displayValueKey="name"
                      value={
                        scheduleOptions.find((s) => s.id === field.value) ||
                        null
                      }
                      onSelect={(item) =>
                        !Array.isArray(item) && field.onChange(item?.id)
                      }
                      icon={FaRepeat}
                    />
                  )}
                />

                {/* Weekly */}
                {period === "weekly" && (
                  <Controller
                    name="schedule.day"
                    control={control}
                    rules={{ required: "Day is required for weekly schedule" }}
                    render={({ field }) => (
                      <Dropdown
                        label="Day"
                        placeholder="Select day"
                        items={dayOptions}
                        displayValueKey="name"
                        value={
                          dayOptions.find((d) => d.id === field.value) || null
                        }
                        onSelect={(item) =>
                          !Array.isArray(item) && field.onChange(item?.id)
                        }
                        icon={FaCalendarDays}
                      />
                    )}
                  />
                )}

                {/* Monthly: allow either dateOfMonth or nth+weekday */}
                {period === "monthly" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Controller
                      name="schedule.dateOfMonth"
                      control={control}
                      render={({ field }) => (
                        <FormInput
                          id="dateOfMonth"
                          type="number"
                          label="Day of month"
                          placeholder="e.g. 15"
                          {...field}
                        />
                      )}
                    />

                    <div className="flex gap-2">
                      <Controller
                        name="schedule.nth"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            label="Nth"
                            placeholder="Select nth"
                            items={[
                              { id: "1st", name: "1st" },
                              { id: "2nd", name: "2nd" },
                              { id: "3rd", name: "3rd" },
                              { id: "4th", name: "4th" },
                              { id: "last", name: "Last" },
                            ]}
                            displayValueKey="name"
                            value={
                              [
                                { id: "1st", name: "1st" },
                                { id: "2nd", name: "2nd" },
                                { id: "3rd", name: "3rd" },
                                { id: "4th", name: "4th" },
                                { id: "last", name: "Last" },
                              ].find((o) => o.id === field.value) || null
                            }
                            onSelect={(item) =>
                              !Array.isArray(item) && field.onChange(item?.id)
                            }
                          />
                        )}
                      />
                      <Controller
                        name="schedule.weekday"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            label="Weekday"
                            placeholder="Select weekday"
                            items={dayOptions}
                            displayValueKey="name"
                            value={
                              dayOptions.find((d) => d.id === field.value) ||
                              null
                            }
                            onSelect={(item) =>
                              !Array.isArray(item) && field.onChange(item?.id)
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Yearly: nothing special input-wise — schedule.month will be derived on submit (or you can show an input if you want) */}
              </div>
            )}

            {/* Recurring preview */}
            {recurrent && (
              <p className="text-sm text-subText mt-2 italic">
                {getRecurringPreview() || "No recurring rule set yet"}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 flex-wrap">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {newEvent.id ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
