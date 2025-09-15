import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { Event } from "../types";
import FormInput from "../../../components/ui/FormInput";
import { FaCalendarDays } from "react-icons/fa6";

/**
 * Subcomponent: DateTimeSection
 */
export const DateTimeSection = ({
  register,
  errors,
}: {
  register: UseFormRegister<Event>;
  errors: FieldErrors<Event>;
}) => (
  <div className="border rounded-lg p-4 border-border space-y-4 bg-background">
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
);
