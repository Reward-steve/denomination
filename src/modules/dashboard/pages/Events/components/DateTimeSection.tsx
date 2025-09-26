import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { Event } from "../../../types";
import FormInput from "../../../../../components/ui/FormInput";
import { FaCalendarDays } from "react-icons/fa6";

interface DateTimeSectionProps {
  register: UseFormRegister<Event>;
  errors: FieldErrors<Event>;
  className?: string; // allows customization
}

/**
 * Subcomponent: DateTimeSection
 * Handles date & time input fields within EventModal
 */
export const DateTimeSection = ({
  register,
  errors,
  className = "",
}: DateTimeSectionProps) => {
  return (
    <section
      className={`border rounded-lg p-3 sm:p-4 md:p-5 border-border space-y-1 bg-background ${className}`}
      aria-labelledby="date-time-title"
    >

      <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
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
    </section>
  );
};
