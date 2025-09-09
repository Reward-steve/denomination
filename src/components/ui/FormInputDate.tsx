import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar } from "react-icons/fa";
import {
  useController,
  type Control,
  type FieldError,
  type FieldPath,
} from "react-hook-form";
import { format, isValid, parseISO } from "date-fns";
import { type FormInputProps } from "../../types/auth.types";

// Extend FormInputProps but replace 'register' and 'ref' with 'control' and exclude 'type'
interface FormInputDateProps<T extends object>
  extends Omit<FormInputProps, "register" | "ref" | "type"> {
  control: Control<T>;
  name: FieldPath<T>;
  error?: FieldError;
}

const FormInputDate = <T extends object>({
  control,
  name,
  label,
  placeholder = "MM/DD/YYYY",
  error,
  className = "",
  optional = false,
  id = name,
  styles,
}: FormInputDateProps<T>) => {
  const { field } = useController({
    name,
    control,
    rules: {
      required: optional ? false : `${label} is required`,
      validate: (value) => {
        if (!value) return true; // Skip if empty (handled by required)
        try {
          const date = parseISO(value.toString());
          return isValid(date) && date <= new Date()
            ? true
            : "Invalid or future date";
        } catch {
          return "Invalid date format";
        }
      },
    },
  });

  return (
    <label className="w-full block" style={styles}>
      {label && (
        <p className="flex">
          <span className="text-sm block font-medium mb-2 text-text">
            {label}
          </span>
          {!optional && (
            <span className="text-sm block font-medium mb-2 text-error">*</span>
          )}
        </p>
      )}
      <div className="relative w-full">
        <FaCalendar
          className="absolute left-3 top-1/2 -translate-y-1/2 text-textPlaceholder"
          size={18}
        />
        <DatePicker
          selected={
            field.value && typeof field.value === "string"
              ? parseISO(field.value)
              : null
          }
          onChange={(date: Date | null) => {
            console.log(`DatePicker (${name}): Selected date =`, date);
            field.onChange(
              date && isValid(date) ? format(date, "yyyy-MM-dd") : null
            );
          }}
          dateFormat="MM/dd/yyyy"
          placeholderText={placeholder}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          maxDate={new Date()}
          yearDropdownItemNumber={100}
          scrollableYearDropdown
          className={`${className} text-sm w-full outline-none bg-white pl-9 pr-10 h-[52px] lg:h-[45px] rounded-xl transition-all duration-200 focus:ring-1 border box-border ${
            error
              ? "border-error text-error ring-error animate-shake"
              : "border-border text-text focus:border-accent focus:ring-accent"
          }`}
          wrapperClassName="w-full"
          popperClassName="z-[1000]" // Ensure calendar is above other elements
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onKeyDown={(e) => e.preventDefault()} // Prevent manual typing
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
