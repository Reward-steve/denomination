import { useLocation, useNavigate } from "react-router-dom";
import { LuPanelRightClose, LuPanelRightOpen } from "react-icons/lu";
import { useState, useCallback } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import type { IconType } from "react-icons";
import clsx from "clsx";
import Logo from "./Logo";
import {
  DASHBOARD_BASE_PATH,
  type AuthSidebarProps,
  type DashboardSidebarProps,
} from "../../constant/index";
import { useRegistration } from "../../hooks/useReg";

export interface SidebarProps {
  label: string;
  Icon?: IconType;
  path: string;
  step: number;
}

interface SidebarLinkProps {
  to: string;
  label: string;
  num: number;
  Icon?: IconType;
  isOpen?: boolean;
  isActive?: boolean;
  disabled?: boolean;
}

const SidebarHeader = ({
  isOpen,
  toggleOpen,
  hideToggle,
}: {
  isOpen: boolean;
  toggleOpen: () => void;
  hideToggle: boolean;
}) => {
  const sidebarBtn = isOpen ? <LuPanelRightOpen /> : <LuPanelRightClose />;
  return (
    <div
      className={`flex items-center ${
        isOpen ? "justify-between" : "justify-center"
      } mb-6`}
    >
      <Logo isCollapsed={!isOpen} />
      {!hideToggle && (
        <button
          onClick={toggleOpen}
          aria-label="Toggle sidebar"
          className="text-md p-2 rounded hover:bg-white hover:text-accent transition-colors"
        >
          {sidebarBtn}
        </button>
      )}
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  label: string;
  num: number;
  step: number; // ✅ added
  Icon?: IconType;
  isOpen?: boolean;
  isActive?: boolean;
  disabled?: boolean;
}

export const SidebarLink = ({
  to,
  label,
  num,
  step,
  Icon,
  isOpen,
  isActive,
  disabled,
}: SidebarLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname.includes("dashboard");
  const basePath = isDashboard ? DASHBOARD_BASE_PATH : "/auth";
  const isStepCompleted = num < step;

  const handleClick = useCallback(() => {
    if (!to) return console.warn(`Invalid path for ${label}`);
    navigate(`${basePath}/${to}`);
  }, [navigate, to, basePath, label]);

  const buttonClasses = clsx(
    "w-full text-left my-4 flex items-center gap-3 p-2 rounded-md transition-colors text-sm hover:bg-accentLight",
    {
      "justify-start": isOpen && isDashboard,
      "justify-center": !isOpen && isDashboard,
      "justify-between": !isDashboard,
      "border-2 border-accent bg-white": isActive && step === num,
      "bg-accentLight": isStepCompleted || (isDashboard && isActive),
      "bg-border": !isStepCompleted && !isActive && !isDashboard,
    }
  );

  return (
    <button
      disabled={disabled}
      title={label}
      aria-label={isOpen ? undefined : label}
      onClick={handleClick}
      className={buttonClasses}
    >
      {Icon && <Icon className="text-lg" />}
      {isOpen && <span className="overflow-hidden">{label}</span>}
      {isStepCompleted && <FaCircleCheck className="text-lg text-green-700" />}
    </button>
  );
};

export const SidebarDesktop = ({
  items,
  disabled,
}: {
  items: (AuthSidebarProps | DashboardSidebarProps)[];
  disabled?: boolean;
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const isAuthPage = location.pathname.includes("auth");

  // ✅ Step is pulled once here
  const { step = 0 } = useRegistration();

  console.log("SidebarDesktop step:", step);

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className={clsx(
        "fixed h-screen top-0 left-0 z-40 md:p-2 transition-all duration-500 md:relative md:translate-x-0",
        isOpen
          ? "md:w-[var(--sidebar-width)]"
          : "md:w-[var(--sidebar-collapsed-width)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-full min-h-screen p-2 w-full md:rounded-md border border-border rounded-none flex flex-col justify-between">
        <div className="flex flex-col static">
          <SidebarHeader
            isOpen={isOpen}
            toggleOpen={() => setIsOpen(!isOpen)}
            hideToggle={isAuthPage}
          />
          {items.length > 0 ? (
            <ul className="space-y-1">
              {items.map(({ label, Icon, path, step: itemStep }) => (
                <li key={label}>
                  <SidebarLink
                    to={path}
                    label={label}
                    num={itemStep!}
                    step={step} // ✅ pass current step here
                    disabled={disabled}
                    Icon={Icon}
                    isOpen={isOpen}
                    isActive={location.pathname.includes(path)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">
              No navigation items available
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
