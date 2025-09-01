import React from "react";
import clsx from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "danger"
    | "ghost"
    | "link"
    | "auth";
  size?: "sm" | "md" | "lg" | "icon";
  textSize?: "xs" | "sm" | "base" | "lg" | "xl";
};

const baseStyles =
  "inline-flex items-center justify-center font-medium rounded-lg transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<string, string> = {
  default: "bg-primary text-white hover:bg-secondary",
  outline: "border border-border text-subText hover:bg-border",
  secondary: "bg-secondary text-white hover:bg-primary",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "hover:bg-border text-subText",
  link: "text-primary underline-offset-4 hover:underline bg-transparent",

  // ✅ Auth-specific button
  auth: `
    w-full flex justify-center
    bg-primary hover:bg-secondary
    text-white hover:text-white
    items-center transition-all
    h-[52px] rounded-lg m-0
  `,
};

const buttonSizes: Record<string, string> = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
  lg: "px-6 py-3",
  icon: "p-2",
};

const textSizes: Record<string, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  textSize = "base",
  className,
  ...props
}) => {
  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        variant !== "auth" && buttonSizes[size], // auth ignores normal sizing
        textSizes[textSize],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
