import React from "react";
import clsx from "classnames";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "link"
    | "auth";
  size?: "sm" | "md" | "lg" | "icon";
  textSize?: "xs" | "sm" | "base" | "lg" | "xl";
};

const baseStyles =
  "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

const sizes: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
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
  variant = "accent",
  size = "md",
  textSize = "sm",
  className,
  ...props
}) => {
  // 🎨 Variants using theme colors instead of hard-coded values
  const variants: Record<string, string> = {
    primary: "bg-accent text-white hover:bg-[#10B981]/80 shadow-sm",
    secondary: "bg-secondary text-white hover:bg-secondary/80 shadow-sm",
    outline: "border border-subText text-text hover:bg-gray-100",
    ghost: "text-text hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600",
    link: "text-secondary underline-offset-4 hover:underline bg-transparent",
    auth: `
    w-full flex justify-center items-center
    bg-accent text-white
    hover:bg-[#10B981]/80 hover:text-white
    transition-all
    h-[52px] rounded-lg m-0
  `,
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        textSizes[textSize],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
