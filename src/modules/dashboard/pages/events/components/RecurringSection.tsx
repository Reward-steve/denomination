import {
  Controller,
  useWatch,
  type Control,
  type UseFormWatch,
} from "react-hook-form";
import { Dropdown } from "../../../../../components/ui/Dropdown";
import { CheckboxField } from "../../../../../components/ui/CheckBoxField";
import { FaCalendarDays, FaRepeat } from "react-icons/fa6";

import {
  dayOptions,
  monthOptions,
  scheduleOptions,
  type Event,
} from "../../../types";

import {
  getNthWeekday,
  getOrdinalSuffix,
  getWeekdayName,
} from "../../../utils/Helper";

/**
 * RecurringSection
 * Handles recurring event configuration with live preview feedback.
 */
export const RecurringSection = ({
  control,
  watch,
}: {
  control: Control<Event, Event>;
  watch: UseFormWatch<Event>;
}) => {
  // Core state from form
  const recurrent = useWatch({ control, name: "recurrent" }) as boolean;
  const period = useWatch({ control, name: "schedule.period" });
  const selectedDay = useWatch({ control, name: "schedule.day" });
  const dateOfMonth = useWatch({ control, name: "schedule.dateOfMonth" });
  const nth = useWatch({ control, name: "schedule.nth" });
  const weekday = useWatch({ control, name: "schedule.weekday" });
  const date = watch("date");
  const time = watch("time") || "00:00";

  /**
   * Generate human-readable recurring rule
   */
  const getRecurringPreview = (): string | null => {
    if (!recurrent || !period || !date) return null;

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null;

    // Apply selected time
    const [hours, minutes] = time.split(":");
    parsedDate.setHours(Number(hours), Number(minutes), 0);

    const formattedTime = parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    switch (period) {
      case "weekly":
        return `Every ${
          selectedDay || getWeekdayName(parsedDate)
        } at ${formattedTime}`;

      case "monthly":
        if (typeof dateOfMonth === "number") {
          return `Every ${getOrdinalSuffix(
            dateOfMonth
          )} day of each month at ${formattedTime}`;
        }
        if (nth && weekday) {
          return `Every ${nth} ${weekday} of each month at ${formattedTime}`;
        }
        return `Every ${getNthWeekday(
          parsedDate
        )} of the month at ${formattedTime}`;

      case "yearly": {
        const selectedMonth = watch("schedule.month"); // 👈 pull from form
        const selectedDay = dateOfMonth || parsedDate.getDate();

        const monthName =
          monthOptions.find((m) => m.id === Number(selectedMonth))?.name ||
          parsedDate.toLocaleDateString([], { month: "long" });

        return `Every ${monthName} ${selectedDay} at ${formattedTime}`;
      }

      default:
        return null;
    }
  };

  return (
    <section
      className="border rounded-lg p-3 sm:p-4 md:p-5 border-border bg-background space-y-4"
      aria-labelledby="recurring-title"
    >
      <h3
        id="recurring-title"
        className="text-base sm:text-lg font-medium text-text mb-2"
      >
        Recurring
      </h3>

      {/* Enable toggle */}
      <Controller
        control={control}
        name="recurrent"
        render={({ field }) => (
          <CheckboxField field={field} label="Enable Recurring" />
        )}
      />

      {recurrent && (
        <div className="space-y-3">
          {/* Schedule Period */}
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
                  scheduleOptions.find((s) => s.id === field.value) || null
                }
                onSelect={(item) =>
                  !Array.isArray(item) && field.onChange(item?.id)
                }
                icon={FaRepeat}
              />
            )}
          />

          {/* Weekly Schedule */}
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
                  value={dayOptions.find((d) => d.id === field.value) || null}
                  onSelect={(item) =>
                    !Array.isArray(item) && field.onChange(item?.id)
                  }
                  icon={FaCalendarDays}
                />
              )}
            />
          )}

          {/* Monthly Schedule */}
          {period === "monthly" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {/* Nth Weekday Option */}
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

              {/* Weekday Option */}
              <Controller
                name="schedule.weekday"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    label="Weekday"
                    placeholder="Select weekday"
                    items={dayOptions}
                    displayValueKey="name"
                    value={dayOptions.find((d) => d.id === field.value) || null}
                    onSelect={(item) =>
                      !Array.isArray(item) && field.onChange(item?.id)
                    }
                  />
                )}
              />
            </div>
          )}

          {/* Yearly Schedule */}
          {period === "yearly" && (
            <Controller
              name="schedule.month"
              control={control}
              rules={{ required: "Month is required for yearly schedule" }}
              render={({ field }) => (
                <Dropdown
                  label="Month"
                  placeholder="Select month"
                  items={monthOptions}
                  displayValueKey="name"
                  value={
                    monthOptions.find((m) => m.id === Number(field.value)) ||
                    null
                  }
                  onSelect={(item) =>
                    !Array.isArray(item) && field.onChange(item?.id)
                  }
                  icon={FaCalendarDays}
                />
              )}
            />
          )}

          {/* Live Preview */}
          <p className="text-xs sm:text-sm text-text-secondary mt-2 italic">
            {getRecurringPreview() || "No recurring rule set yet"}
          </p>
        </div>
      )}
    </section>
  );
};
