import { type TextAreaProps } from "../../types/auth.types";

const TextArea = ({
  id,
  label,
  placeholder,
  register,
  error,
  className = "",
  optional,
  styles,
  ...rest
}: TextAreaProps) => {
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
        <textarea
          id={id}
          placeholder={placeholder}
          rows={4}
          className={`${className} accent-accent text-sm w-full outline-none bg-surface p-4 rounded-xl transition-all duration-200 focus:ring-1 ${
            error
              ? "border border-error text-error ring-error animate-shake"
              : "border border-border text-text focus:border-accent focus:ring-accent"
          }`}
          {...register}
          style={styles}
          {...rest}
        ></textarea>
      </div>
      {error && (
        <p className="text-xs text-error mt-1 font-light animate-shake">
          {error.message}
        </p>
      )}
    </label>
  );
};

export default TextArea;
