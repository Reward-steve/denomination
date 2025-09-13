import { useEffect, useMemo, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import type { IconType } from "react-icons";
import type { DropdownOption } from "../../types/auth.types";
import { Loader } from "./Loader";

interface BaseDropdownProps<T extends DropdownOption> {
  label: string;
  items: T[];
  displayValueKey: keyof T;
  icon?: IconType;
  size?: "small" | "medium" | "big";
  placeholder?: string;
  isError?: boolean;
  errorMsg?: string;
  loading?: boolean;
  disabled?: boolean;
  optional?: boolean;
  defaultValue?: T | T[];
  acceptChange?: boolean;
}

interface SingleDropdownProps<T extends DropdownOption>
  extends BaseDropdownProps<T> {
  multiple?: false;
  value?: T | null;
  onSelect: (selected: T | null) => void;
}

interface MultiDropdownProps<T extends DropdownOption>
  extends BaseDropdownProps<T> {
  multiple: true;
  value?: T[];
  onSelect: (selected: T[]) => void;
}

export type DropdownProps<T extends DropdownOption> =
  | SingleDropdownProps<T>
  | MultiDropdownProps<T>;

export function Dropdown<T extends DropdownOption>({
  items,
  size = "big",
  label,
  isError = false,
  errorMsg = "This field is required",
  displayValueKey,
  defaultValue,
  value,
  onSelect,
  loading = false,
  acceptChange = true,
  optional = false,
  disabled,
  icon: Icon,
  multiple = false,
  placeholder = "Select...",
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<T | T[] | null>(
    defaultValue ?? (multiple ? [] : null)
  );

  useEffect(() => {
    if (value === null || value === undefined) {
      setInternalSelected(multiple ? [] : null);
    }
  }, [value, multiple]);

  // Determine selected value
  const selected: T | T[] | null =
    value !== undefined ? value : internalSelected;

  const getLabel = (item: T) => String(item[displayValueKey]);

  const toggleDropdown = () => {
    if (disabled || loading) return;
    setIsOpen((prev) => !prev);
  };

  const handleChange = (item: T) => {
    if (multiple) {
      const current = Array.isArray(selected) ? [...selected] : [];
      const exists = current.some(
        (s) => getLabel(s).toLowerCase() === getLabel(item).toLowerCase()
      );
      const newSelected = exists
        ? current.filter((s) => getLabel(s) !== getLabel(item))
        : [...current, item];

      if (value === undefined) setInternalSelected(newSelected);
      (onSelect as (s: T[]) => void)(newSelected);
    } else {
      if (value === undefined) setInternalSelected(item);
      (onSelect as (s: T | null) => void)(item);
      setIsOpen(false);
    }
  };

  const processedItems = useMemo(
    () =>
      acceptChange
        ? items.map((item) => ({ ...item, id: String(item.id) }))
        : items,
    [items, acceptChange]
  );

  const inputSize =
    size === "big"
      ? "h-[52px] text-sm"
      : size === "medium"
      ? "h-10 text-sm"
      : "h-9 text-xs";

  const displayValue = loading
    ? ""
    : multiple
    ? Array.isArray(selected)
      ? selected.map(getLabel).join(", ")
      : ""
    : selected
    ? getLabel(selected as T)
    : "";

  return (
    <div className="w-full max-w-xl relative">
      {label && (
        <p className="mb-1 text-sm font-medium text-text">
          {label}
          {!optional && <span className="ml-1 text-error">*</span>}
        </p>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
        )}

        <input
          type="text"
          className={`bg-surface w-full rounded-xl border transition-colors outline-none pr-9 ${
            Icon ? "pl-9" : "pl-3"
          } ${inputSize} ${
            isError
              ? "border-error focus:ring-1 focus:ring-error"
              : isOpen
              ? "border-accent focus:ring-1 focus:ring-accent"
              : "border-border"
          } ${disabled || loading ? "cursor-not-allowed opacity-70" : ""}`}
          placeholder={loading ? "Loading..." : placeholder}
          value={displayValue}
          readOnly
          disabled={disabled || loading}
          onClick={toggleDropdown}
        />

        {loading ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <Loader size={18} />
          </div>
        ) : (
          <GoChevronDown
            size={20}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform text-primary ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </div>

      {isError && <p className="mt-1 text-xs text-error">{errorMsg}</p>}

      {isOpen && !loading && (
        <div className="absolute z-20 mt-1 w-full max-h-72 overflow-y-auto rounded-lg bg-surface shadow-lg border border-border animate-fadeIn text-sm">
          {processedItems.length > 0 ? (
            processedItems.map((item, i) => {
              const active = multiple
                ? Array.isArray(selected) &&
                  selected.some((s) => getLabel(s) === getLabel(item))
                : selected && getLabel(selected as T) === getLabel(item);

              return (
                <div
                  key={i}
                  className={`px-3 py-2 cursor-pointer ${
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-border"
                  }`}
                  onClick={() => handleChange(item)}
                >
                  {getLabel(item)}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-2 text-gray-400">No options available</div>
          )}
        </div>
      )}
    </div>
  );
}
