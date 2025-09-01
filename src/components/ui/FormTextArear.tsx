import type { FormInputProps } from "../../types/auth.types";

export default function FormTextArea({
  label,
  placeholder,
  register,
  error,
}: FormInputProps) {
  return (
    <label className="w-full block mt-4">
      {label && <span className="block mb-1 font-medium">{label}</span>}
      <textarea
        {...register}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-md resize-none outline-light-primary transition-all duration-200
          ${
            error
              ? "border-error focus:outline-error animate-shake"
              : "border-light-secondary focus:outline-light-primary"
          }`}
      />
      {error && (
        <p className="text-error text-sm mt-1 animate-shake">{error.message}</p>
      )}
    </label>
  );
}
