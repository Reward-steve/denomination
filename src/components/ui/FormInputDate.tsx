import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar } from "react-icons/fa";
import {
  useController,
  type Control,
  type FieldErrors,
  type FieldPath,
} from "react-hook-form";
import { format, isValid, parseISO } from "date-fns";
import { type FormInputProps } from "../../types/auth.types"; // Adjust path to your types

// Extend FormInputProps but replace 'register' with 'control' for react-hook-form's useController
interface FormInputDateProps<T extends object>
  extends Omit<FormInputProps, "register" | "ref"> {
  control: Control<T>;
  name: FieldPath<T>;
  error?: FieldErrors<T>[FieldPath<T>];
}

const FormInputDate = <T extends object>({
  control,
  name,
  label,
  placeholder = "MM/DD/YYYY",
  error,
  className = "",
  optional = false,
  styles,
  id = name,
}: FormInputDateProps<T>) => {
  const { field } = useController({
    name,
    control,
    rules: {
      required: optional ? false : "Date of Birth is required",
      validate: (value) => {
        if (!value) return true; // Skip if empty (handled by required)
        const date = parseISO(value.toString());
        return isValid(date) && date <= new Date()
          ? true
          : "Invalid or future date";
      },
    },
  });

  return (
    <label className="w-full block">
      {label && (
        <p className="flex">
          <span className="text-sm block font-small mb-2 text-text">
            {label}
          </span>
          {!optional && (
            <span className="text-sm block font-small mb-2 text-error">*</span>
          )}
        </p>
      )}
      <div className="relative">
        <FaCalendar className="absolute bottom-4 left-3 text-neutral" />
        <DatePicker
          selected={field.value ? parseISO(field.value.toString()) : null} // Parse YYYY-MM-DD to Date
          onChange={
            (date: Date | null) =>
              field.onChange(
                date && isValid(date) ? format(date, "yyyy-MM-dd") : null
              ) // Format to YYYY-MM-DD
          }
          dateFormat="MM/dd/yyyy" // User-friendly display format
          placeholderText={placeholder}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          maxDate={new Date()} // Prevent future dates
          yearDropdownItemNumber={100} // Show 100 years
          scrollableYearDropdown
          className={`${className} accent-accent text-sm w-full outline-none bg-transparent pl-9 pr-10 h-[52px] rounded-xl transition-all duration-200 focus:ring-1 ${
            error
              ? "border border-error text-error ring-error animate-shake"
              : "border border-border text-text focus:border-accent focus:ring-accent"
          }`}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          style={styles}
        />
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="text-xs text-error mt-1 font-light animate-shake"
        >
          {error.message}
        </p>
      )}
    </label>
  );
};

export default FormInputDate;
