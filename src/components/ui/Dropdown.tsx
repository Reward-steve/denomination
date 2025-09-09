import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { type IconType } from "react-icons";

type DSize = "small" | "big";

interface IDropDown {
  items: Array<Record<string, any>> | Array<string>;
  size?: DSize;
  label?: string;
  errorMsg?: string;
  filterable?: boolean;
  isError?: boolean;
  displayValueKey?: string;
  onSelect?: (item: any, runChange?: () => void) => void;
  defaultValue?: Record<string, any> | string;
  disabled?: boolean;
  loading?: boolean;
  acceptChange?: boolean;
  optional?: boolean;
  icon?: IconType;
  [key: string]: unknown;
}

interface IDropDownItem {
  active?: boolean;
  children: React.ReactNode;
  value?: string;
  ref?: any;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const loader = (
  <svg
    className="loader"
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
  >
    <circle cx={4} cy={12} r={3} fill="currentColor">
      <animate
        id="svgSpinners3DotsFade0"
        fill="freeze"
        attributeName="opacity"
        begin="0;svgSpinners3DotsFade1.end-0.25s"
        dur="0.75s"
        values="1;0.2"
      ></animate>
    </circle>
    <circle cx={12} cy={12} r={3} fill="currentColor" opacity={0.4}>
      <animate
        fill="freeze"
        attributeName="opacity"
        begin="svgSpinners3DotsFade0.begin+0.15s"
        dur="0.75s"
        values="1;0.2"
      ></animate>
    </circle>
    <circle cx={20} cy={12} r={3} fill="currentColor" opacity={0.3}>
      <animate
        id="svgSpinners3DotsFade1"
        fill="freeze"
        attributeName="opacity"
        begin="svgSpinners3DotsFade0.begin+0.3s"
        dur="0.75s"
        values="1;0.2"
      ></animate>
    </circle>
  </svg>
);

export function Dropdown({
  items,
  size = "big",
  label,
  filterable = false,
  isError = false,
  errorMsg = "This field is required",
  displayValueKey = "",
  defaultValue = "",
  onSelect,
  loading = false,
  acceptChange = true,
  optional = false,
  disabled,
  icon: Icon,
  ...rest
}: IDropDown) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>("");

  const dropStyles = css({
    width: "100%",
    maxWidth: 700,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    overflow: isOpen ? "visible" : "hidden",
    ".label": {
      color: theme.colors.text,
    },
    ".loader": {
      position: "absolute",
      left: 10,
      bottom: size === "big" ? "16px" : "12px",
      cursor: "not-allowed",
    },
    ".dd-input": {
      height: size === "big" ? "52px" : "40px",
      "@media (min-width: 1024px)": {
        height: size === "big" ? "45px" : "36px",
      },
      border: isError
        ? `1px solid ${theme.colors.error}`
        : `1px solid ${isOpen ? theme.colors.accent : theme.colors.border}`,
      borderRadius: "0.75rem",
      paddingLeft: Icon ? "2.25rem" : "1rem",
      paddingRight: "2.5rem",
      fontSize: size === "big" ? "0.875rem" : "0.75rem",
      outline: "none",
      transition: "all 0.2s",
      cursor: filterable ? "auto" : "pointer",
      color: loading ? "transparent" : theme.colors.text,
      boxSizing: "border-box",
      ...(isError && {
        animation: "shake 0.5s ease-in-out",
        boxShadow: `0 0 0 1px ${theme.colors.error}`,
        color: theme.colors.error,
      }),
      "&:focus": {
        borderColor: theme.colors.accent,
        boxShadow: `0 0 0 1px ${theme.colors.accent}`,
      },
      "&:disabled": {
        cursor: "not-allowed",
      },
      "&::placeholder": {
        color: loading ? "transparent" : theme.colors.textPlaceholder,
      },
    },
    ".children": {
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 4px 21px -9px #00000036",
      position: "absolute",
      zIndex: 10,
      width: "100%",
      maxHeight: 300,
      overflowY: "auto",
      top: "calc(100% + 3px)",
      left: 0,
      display: isOpen ? "block" : "none", // Ensure visibility toggle
      animation: isOpen
        ? "_fadeInDown 0.3s ease-out"
        : "_fadeOutUp 0.3s ease-out",
    },
  });

  const filteredItems = Array.isArray(items)
    ? items.filter((item) => {
        if (!filterable || !selectedValue) return true;
        if (typeof item === "object" && displayValueKey) {
          return String(item[displayValueKey])
            .toLowerCase()
            .includes(selectedValue.toLowerCase());
        }
        return String(item).toLowerCase().includes(selectedValue.toLowerCase());
      })
    : [];

  const runChange = (item: Record<string, any> | string) => {
    setSelectedValue(
      typeof item === "object" && displayValueKey
        ? item[displayValueKey as keyof typeof item]
        : item
    );
    if (onSelect && acceptChange) {
      onSelect(item);
    }
    setIsOpen(false);
  };

  const handleChange = (item: Record<string, any> | string) => {
    if (onSelect && !acceptChange) {
      onSelect(item, () => runChange(item));
    } else {
      runChange(item);
    }
  };

  const toggleDropdown = () => {
    if (disabled || loading) return;
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (defaultValue !== "") {
      setSelectedValue(
        typeof defaultValue === "object"
          ? defaultValue[displayValueKey as keyof typeof defaultValue]
          : defaultValue || ""
      );
    }
  }, [defaultValue, displayValueKey]);

  return (
    <div className={`${dropStyles}`}>
      <div className="input-cont flex flex-col w-full text-sm">
        {label && (
          <p className="flex">
            <span className="text-sm block font-small mb-2 text-text">
              {label}
            </span>
            {!optional && (
              <span className="text-sm block font-small mb-2 text-error">
                *
              </span>
            )}
          </p>
        )}
        <div
          className="relative w-full"
          onClick={() => {
            toggleDropdown();
          }}
          role="button"
          tabIndex={0}
        >
          {loading && loader}
          {Icon && <Icon className="absolute bottom-4 left-3 text-neutral" />}
          <input
            type="text"
            value={selectedValue}
            onChange={
              filterable
                ? (e) => {
                    setSelectedValue(e.currentTarget.value);
                    if (!isOpen) setIsOpen(true);
                  }
                : undefined
            }
            className="dd-input bg-surface border border-border w-full placeholder:text-text-placeholder"
            readOnly={!filterable}
            onBlur={(e) => {
              if (
                (
                  e.relatedTarget as HTMLDivElement
                )?.parentElement?.classList.contains("children")
              )
                return;
              if (isOpen) setIsOpen(false);
            }}
            disabled={disabled}
            {...rest}
          />
          <GoChevronDown
            size={20}
            className={`absolute bottom-4 right-3 text-primary ${
              isOpen ? "rotate-180" : ""
            } ${disabled || loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            color={loading ? theme.colors.neutral : theme.colors.accent}
            onClick={() => {
              toggleDropdown();
            }}
          />
        </div>
        {isError && (
          <p className="text-xs text-error mt-1 font-light animate-shake">
            {errorMsg}
          </p>
        )}
      </div>
      <div
        className={`children ${
          isOpen ? "_fadeInDown" : "_fadeOutUp"
        } bg-surface border border-border`}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item, i) => (
            <DropdownItem
              key={i}
              onClick={() => {
                handleChange(item);
              }}
              active={
                selectedValue ===
                (typeof item === "object" && displayValueKey
                  ? item[displayValueKey]
                  : String(item))
              }
            >
              {typeof item === "object" && displayValueKey
                ? item[displayValueKey]
                : String(item)}
            </DropdownItem>
          ))
        ) : (
          <div className="px-3 py-2 text-gray-400">No results</div>
        )}
      </div>
    </div>
  );
}

export function DropdownItem({
  children,
  active = false,
  onClick,
  ref,
}: IDropDownItem) {
  const itemStyles = css({
    padding: "5px 10px",
    fontWeight: active ? "600" : "normal",
    cursor: "pointer",
    fontSize: "14px",
  });
  return (
    <div
      ref={ref}
      className={`${itemStyles} ${
        active ? "text-primary" : "text-text-secondary"
      } hover:bg-border`}
      tabIndex={-1}
      role="button"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
