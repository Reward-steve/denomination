import { css } from "@emotion/css";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import { GoChevronDown } from "react-icons/go";

interface IDropDown {
  items: Array<Record<string, any>> | Array<string>;
  label?: string;
  errorMsg?: string;
  filterable?: boolean; //if it allow filtering
  isError?: boolean;
  displayValueKey?: string; // if items are objects, this is the key to display
  onSelect?: (item: any, runChange?: () => void) => void; // callback when an item is selected
  defaultValue?: Record<string, any> | string; // default dropdown value
  disbled?: boolean; // if true, dropdown is disabled
  loading?: boolean;
  acceptChange?: boolean; // default is true, otherwise a callback will be available for you in the onSelect() Prop to fire the handleChange yourself when you're satisfy
  [key: string]: unknown; // for other props like onChange, value, etc
}

//items
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
  label,
  filterable = false,
  isError = false,
  errorMsg = "This field is required",
  displayValueKey = "",
  defaultValue = "",
  onSelect,
  loading = false,
  acceptChange = true,
  optional,
  ...rest
}: IDropDown) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

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
      bottom: "16px", // Align with icon
      cursor: "not-allowed",
    },
    ".dd-input": {
      height: "52px", // Match FormInput's h-[52px]
      "@media (min-width: 1024px)": {
        height: "45px", // Match FormInput's lg:h-[45px]
      },
      border: isError
        ? `1px solid ${theme.colors.error}` // Match FormInput's border-error
        : `1px solid ${isOpen ? theme.colors.accent : theme.colors.border}`,
      borderRadius: "0.75rem", // Match rounded-xl (12px)
      paddingLeft: "2.25rem", // Match pl-9
      paddingRight: "2.5rem", // Match pr-10
      fontSize: "0.875rem", // Match text-sm
      backgroundColor: "white", // Match bg-white
      outline: "none",
      transition: "all 0.2s", // Match transition-all duration-200
      cursor: filterable ? "auto" : "pointer",
      color: loading ? "transparent" : theme.colors.text,
      boxSizing: "border-box",
      ...(isError && {
        animation: "shake 0.5s ease-in-out", // Match animate-shake
        boxShadow: `0 0 0 1px ${theme.colors.error}`, // Match ring-error
        color: theme.colors.error, // Match text-error
      }),
      "&:focus": {
        borderColor: theme.colors.accent, // Match focus:border-accent
        boxShadow: `0 0 0 1px ${theme.colors.accent}`, // Match focus:ring-1 focus:ring-accent
      },
      "&:disabled": {
        cursor: "not-allowed",
      },
      "&::placeholder": {
        color: loading ? "transparent" : theme.colors.textPlaceholder,
      },
    },
    ".children": {
      border: `1px solid ${theme.colors.border}`,
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: "0 4px 21px -9px #00000036",
      position: "absolute",
      zIndex: 10,
      backgroundColor: theme.colors.background,
      width: "100%",
      maxHeight: 300,
      overflowY: "auto",
      top: "calc(100% + 3px)",
      left: 0,
    },
  });

  // const [selected, setSelected] = useState<Record<string, any> | string>(defaultValue);

  const [selectedValue, setSelectedValue] = useState<string>("");

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
    toggleDropdown();
  };

  const handleChange = (item: Record<string, any> | string) => {
    if (onSelect && !acceptChange) {
      onSelect(item, () => runChange(item));
    } else {
      runChange(item);
    }
  };

  const toggleDropdown = () => {
    if (rest.disabled || loading) {
      return;
    }
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
  }, [defaultValue]);

  return (
    <div className={dropStyles}>
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
          className={`flex items-center cursor-pointer animated ${
            isError ? "headShake" : ""
          }`}
          onClick={toggleDropdown}
          role="button"
          tabIndex={-1}
        >
          {loading && loader}

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
            className="dd-input w-full bg-white outline-none"
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
            {...rest}
          />

          <GoChevronDown
            size={20}
            className={`mx-[-35px] chev ${isOpen ? "rotate" : ""} ${
              rest.disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            color={loading ? theme.colors.neutral : theme.colors.accent}
          />
        </div>
        {isError && <small className="text-red-400 pl-2">{errorMsg}</small>}
      </div>
      <div className={`children ${isOpen ? "_fadeInDown" : "_fadeOutUp"}`}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, i) => {
            return (
              <DropdownItem
                key={i}
                onClick={() => handleChange(item)}
                active={
                  selectedValue === item[displayValueKey as keyof typeof item]
                }
              >
                {typeof item === "object" && displayValueKey
                  ? item[displayValueKey]
                  : String(item)}
              </DropdownItem>
            );
          })
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
  const theme = useTheme();
  const itemStyles = css({
    padding: "5px 10px",
    color: active ? `${theme.colors.accent}` : `${theme.colors.textSecondary}`,
    fontWeight: active ? "600" : "normal",
    cursor: "pointer",
    fontSize: "14px",
    // borderBottom: `1px solid ${theme.colors.border}`,

    "&:hover": {
      backgroundColor: `${theme.colors.border}`,
    },
  });
  return (
    <div
      ref={ref}
      className={itemStyles}
      tabIndex={-1}
      role="button"
      onClick={onClick}
    >
      {children}
    </div>
  );
}
