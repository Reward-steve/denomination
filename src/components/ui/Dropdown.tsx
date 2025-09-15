import { useEffect, useMemo, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import type { IconType } from "react-icons";
import type { DropdownOption } from "../../types/auth.types";
import { Loader } from "./Loader";
import { CheckboxField } from "./CheckBoxField";

/* ==============================
   🔹 Base Dropdown Props
   Defines the common props shared by both single & multi dropdowns
================================ */
interface BaseDropdownProps<T extends DropdownOption> {
  label: string;
  items: T[];
  displayValueKey: keyof T; // Which field to display (e.g. "name")
  icon?: IconType;
  size?: "small" | "medium" | "big";
  placeholder?: string;
  isError?: boolean;
  errorMsg?: string;
  loading?: boolean;
  disabled?: boolean;
  optional?: boolean;
  defaultValue?: T | T[];
  acceptChange?: boolean; // Auto-cast IDs to string
}

/* ==============================
   🔹 Single-select dropdown
================================ */
interface SingleDropdownProps<T extends DropdownOption>
  extends BaseDropdownProps<T> {
  multiple?: false;
  value?: T | null;
  onSelect: (selected: T | null) => void;
}

/* ==============================
   🔹 Multi-select dropdown
================================ */
interface MultiDropdownProps<T extends DropdownOption>
  extends BaseDropdownProps<T> {
  multiple: true;
  value?: T[];
  onSelect: (selected: T[]) => void;
}

/* ==============================
   🔹 Combined Prop Type
================================ */
export type DropdownProps<T extends DropdownOption> =
  | SingleDropdownProps<T>
  | MultiDropdownProps<T>;

/* ==============================
   🔹 Dropdown Component
================================ */
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
  /* --- Local State --- */
  const [isOpen, setIsOpen] = useState(false);

  // Internal state when parent does not control selection
  const [internalSelected, setInternalSelected] = useState<T | T[] | null>(
    defaultValue ?? (multiple ? [] : null)
  );

  /* --- Keep internal state in sync if parent clears value --- */
  useEffect(() => {
    if (value === null || value === undefined) {
      setInternalSelected(multiple ? [] : null);
    }
  }, [value, multiple]);

  // Prefer parent value (controlled), else internal
  const selected: T | T[] | null =
    value !== undefined ? value : internalSelected;

  // Extract display label for an item
  const getLabel = (item: T) => String(item[displayValueKey]);

  // Toggle dropdown open/close
  const toggleDropdown = () => {
    if (!disabled && !loading) {
      setIsOpen((prev) => !prev);
    }
  };

  // Handle item (or checkbox) selection
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
      setIsOpen(false); // Close dropdown after selection
    }
  };

  // Normalize item IDs if acceptChange is enabled
  const processedItems = useMemo(
    () =>
      acceptChange
        ? items.map((item) => ({ ...item, id: String(item.id) }))
        : items,
    [items, acceptChange]
  );

  // Input height styles
  const inputSize =
    size === "big"
      ? "h-[52px] text-sm"
      : size === "medium"
      ? "h-10 text-sm"
      : "h-9 text-xs";

  // Display selected items
  const displayValue = loading
    ? ""
    : multiple
    ? Array.isArray(selected)
      ? selected.map(getLabel).join(", ")
      : ""
    : selected
    ? getLabel(selected as T)
    : "";

  /* --- Render --- */
  return (
    <div className="w-full max-w-xl relative">
      {/* Label */}
      {label && (
        <p className="mb-1 text-sm font-medium text-text">
          {label}
          {!optional && <span className="ml-1 text-error">*</span>}
        </p>
      )}

      {/* Input Field */}
      <div className="relative">
        {/* Left-side Icon */}
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" />
        )}

        {/* Input Display */}
        <input
          type="text"
          className={`bg-surface w-full rounded-xl border transition-colors outline-none pr-9
            ${Icon ? "pl-9" : "pl-3"}
            ${inputSize}
            ${
              isError
                ? "border-error focus:ring-1 focus:ring-error"
                : isOpen
                ? "border-accent focus:ring-1 focus:ring-accent"
                : "border-border"
            }
            ${disabled || loading ? "cursor-not-allowed opacity-70" : ""}`}
          placeholder={loading ? "Loading..." : placeholder}
          value={displayValue}
          readOnly
          disabled={disabled || loading}
          onClick={toggleDropdown}
        />

        {/* Loader or Chevron */}
        {loading ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <Loader size={18} />
          </div>
        ) : (
          <GoChevronDown
            size={20}
            onClick={toggleDropdown}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform text-primary cursor-pointer
              ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </div>

      {/* Error Message */}
      {isError && <p className="mt-1 text-xs text-error">{errorMsg}</p>}

      {/* Dropdown List */}
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
                  className={`px-3 py-2 flex items-center gap-2
                    cursor-pointer
                    ${
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-border"
                    }`}
                  // Only toggle when clicking outside the checkbox
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("label")) return; // ✅ ignore clicks inside CheckboxField
                    handleChange(item);
                  }}
                >
                  {multiple ? (
                    <CheckboxField
                      field={{
                        name: getLabel(item),
                        value: active,
                        onChange: () => handleChange(item),
                        onBlur: () => {},
                        ref: () => {},
                      }}
                      label={getLabel(item)}
                    />
                  ) : (
                    getLabel(item)
                  )}
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
