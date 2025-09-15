import clsx from "clsx";
import { type ControllerRenderProps } from "react-hook-form";

type CheckboxFieldProps = {
  field: ControllerRenderProps<any, any>;
  label: string;
};

export function CheckboxField({ field, label }: CheckboxFieldProps) {
  return (
    <label
      htmlFor={field.name}
      className="flex items-center gap-3 cursor-pointer select-none"
    >
      <div
        className={clsx(
          "relative w-5 h-5 rounded-md border transition-all duration-200",
          field.value
            ? "bg-accent border-accent"
            : "bg-background border-border",
          "hover:border-accent"
        )}
      >
        {field.value && (
          <svg
            className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <input
        type="checkbox"
        id={field.name}
        checked={!!field.value}
        onChange={(e) => field.onChange(e.target.checked)}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
        className="hidden"
      />
      <span className="text-sm text-text">{label}</span>
    </label>
  );
}
