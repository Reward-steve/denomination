import { type FormInputProps } from "../../types/auth.types";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const FormInput = ({
  id,
  maxLength,
  type = "text",
  label,
  placeholder,
  icon: Icon,
  register,
  error,
  className = "",
  parentClassName = "",
  optional,
  styles,
  ...rest
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <label className={`w-full block ${parentClassName}`}>
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
        {Icon && <Icon className="absolute top-1/2 -translate-y-1/2 left-3 text-neutral" />}
        <input
          id={id}
          maxLength={maxLength}
          type={inputType}
          placeholder={placeholder}
          className={`${className} accent-accent text-sm w-full outline-none bg-surface ${
            Icon ? "pl-9" : "pl-4"
          } pr-10 h-[52px] lg:h-[45px] rounded-xl transition-all duration-200 focus:ring-1 ${
            error
              ? "border border-error text-error ring-error animate-shake"
              : "border border-border text-text focus:border-accent focus:ring-accent"
          }`}
          {...register}
          style={styles}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute bottom-5 right-3 text-subText focus:outline-none"
          >
            {showPassword ? (
              <FaEyeSlash className="h-4 w-4 text-accent" />
            ) : (
              <FaEye className="h-4 w-4 text-accent" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-error mt-1 font-light animate-shake">
          {error.message}
        </p>
      )}
    </label>
  );
};

export default FormInput;
