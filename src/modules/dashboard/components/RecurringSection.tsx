import {
  Controller,
  useWatch,
  type Control,
  type UseFormWatch,
} from "react-hook-form";
import { Dropdown } from "../../../components/ui/Dropdown";
import FormInput from "../../../components/ui/FormInput";
import { FaCalendarDays, FaRepeat } from "react-icons/fa6";
import { dayOptions, scheduleOptions, type Event } from "../types";
import { CheckboxField } from "../../../components/ui/CheckBoxField";
import {
  getNthWeekday,
  getOrdinalSuffix,
  getWeekdayName,
} from "../utils/Helper";

/**
 * Subcomponent: RecurringSection
 */
export const RecurringSection = ({
  control,
  watch,
}: {
  control: Control<Event, any, Event>;
  watch: UseFormWatch<Event>;
}) => {
  const recurrent = useWatch({ control, name: "recurrent" }) as boolean;
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
  const date = watch("date") as string | undefined;
  const time = watch("time") || "00:00";

  const getRecurringPreview = (): string | null => {
    if (!recurrent || !period || !date) return null;
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return null;

    const [hours, minutes] = time.split(":");
    parsedDate.setHours(Number(hours), Number(minutes), 0);
    const weekdayName = getWeekdayName(parsedDate);

    switch (period) {
      case "daily":
        return `Every day at ${parsedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      case "weekly":
        return `Every ${
          selectedDay || weekdayName
        } at ${parsedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      case "monthly":
        if (typeof dateOfMonth === "number") {
          return `Every ${getOrdinalSuffix(
            dateOfMonth
          )} of each month at ${parsedDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
        }
        if (nth && weekday) {
          return `Every ${nth} ${weekday} of each month at ${parsedDate.toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" }
          )}`;
        }
        return `Every ${getNthWeekday(
          parsedDate
        )} at ${parsedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      case "yearly":
        return `Every ${parsedDate.toLocaleDateString([], {
          month: "long",
          day: "numeric",
        })} at ${parsedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      default:
        return null;
    }
  };

  // if (!recurrent) return null;

  return (
    <div className="border rounded-lg p-4 border-border bg-background space-y-4">
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
                  scheduleOptions.find((s) => s.id === field.value) || null
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
                  value={dayOptions.find((d) => d.id === field.value) || null}
                  onSelect={(item) =>
                    !Array.isArray(item) && field.onChange(item?.id)
                  }
                  icon={FaCalendarDays}
                />
              )}
            />
          )}
          {/* Monthly */}
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
                        dayOptions.find((d) => d.id === field.value) || null
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
          {/* Recurring preview */}
          <p className="text-sm text-text-secondary mt-2 italic">
            {getRecurringPreview() || "No recurring rule set yet"}
          </p>
        </div>
      )}
    </div>
  );
};
