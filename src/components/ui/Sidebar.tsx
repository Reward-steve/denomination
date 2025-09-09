import { useLocation, useNavigate } from "react-router-dom";
import { LuPanelRightClose, LuPanelRightOpen } from "react-icons/lu";
import { useState, useCallback, memo } from "react";
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
import { useResponsive } from "../../hooks/useResponsive";
import { Link } from "react-router-dom";

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
      className={clsx(
        "flex items-center mb-6",
        isOpen ? "justify-between" : "justify-center"
      )}
    >
      <Logo isCollapsed={!isOpen} />
      {!hideToggle && (
        <button
          onClick={toggleOpen}
          aria-label="Toggle sidebar"
          className="text-md p-2 rounded text-text-secondary hover:bg-neutral/10 transition-colors"
        >
          {sidebarBtn}
        </button>
      )}
    </div>
  );
};

export const SidebarLink = memo(
  ({ to, label, num, Icon, isActive, disabled, isOpen }: SidebarLinkProps) => {
    const { step = 0 } = useRegistration();
    const navigate = useNavigate();
    const isDashboard = useLocation().pathname.includes("dashboard");
    const isStepCompleted = num < step;

    const handleClick = useCallback(() => {
      if (!to) {
        console.warn(`Invalid path for ${label}`);
        return;
      }
      navigate(`${DASHBOARD_BASE_PATH}/${to}`);
    }, [navigate, to, label]);

    const buttonClasses = clsx(
      "w-full text-left my-2 flex items-center gap-3 p-2 rounded-md transition-colors duration-200 text-sm hover:bg-accent-light",
      {
        // Layout
        "justify-start": isOpen && isDashboard,
        "justify-center": !isOpen && isDashboard,
        "justify-between": !isDashboard,

        // Active state
        "border-2 border-primary bg-surface text-primary":
          isActive && step === num,
        "bg-accent/10 text-accent": isDashboard && isActive,

        // Completed step
        "bg-primary/10 text-primary": !isActive && isStepCompleted,

        // Incomplete step
        "bg-neutral/10 text-text-secondary": !isActive && !isStepCompleted,

        // Disabled state
        "cursor-not-allowed": disabled,

        // Default fallback
        "bg-smooth": isDashboard && !isActive,
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
        {isStepCompleted && <FaCircleCheck className="text-lg text-primary" />}
      </button>
    );
  }
);

export const ResponsiveNav = ({
  items,
  disabled,
}: {
  items: (AuthSidebarProps | DashboardSidebarProps)[];
  disabled?: boolean;
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const isAuthPage = location.pathname.includes("auth");
  const { isMobile } = useResponsive();

  // --- Mobile: Bottom Nav ---
  if (isMobile) {
    return disabled ? (
      <></>
    ) : (
      <nav
        className={clsx(
          "fixed backdrop-blur-xl border-t border-border bottom-0 left-0 w-full bg-background shadow-lg flex justify-around py-2 z-50 transition-transform duration-300 animate-fade",
          isMobile ? "translate-y-0" : "translate-y-full"
        )}
      >
        {items.map(({ label, Icon, path }) => {
          const isActive = location.pathname.includes(path);
          return (
            <Link
              to={`${DASHBOARD_BASE_PATH}/${path}`}
              key={label}
              title={label}
              className={clsx(
                "flex flex-col items-center text-xs p-2 transition-colors duration-200",
                isActive
                  ? "text-accent bg-accent-light rounded-md"
                  : "text-text-secondary hover:bg-neutral"
              )}
            >
              {Icon && <Icon className="text-xl mb-1" />}
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <aside
      role="navigation"
      aria-label="Main navigation"
      className={clsx(
        "fixed h-screen top-0 left-0 z-40 transition-all flex justify-center items-center duration-500 md:relative md:translate-x-0 bg-background",
        isOpen
          ? "md:w-[var(--sidebar-width)]"
          : "md:w-[var(--sidebar-collapsed-width)]",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="h-[98%] w-[96%] bg-surface p-2 md:rounded-md border border-border rounded-none flex flex-col justify-between">
        <div className="flex flex-col static">
          <SidebarHeader
            isOpen={isOpen}
            toggleOpen={() => setIsOpen(!isOpen)}
            hideToggle={isAuthPage}
          />
          {items.length > 0 ? (
            <ul className="space-y-1">
              {items.map(({ label, Icon, path, step }) => (
                <li key={label}>
                  <SidebarLink
                    to={path}
                    label={label}
                    num={step!}
                    disabled={disabled}
                    Icon={Icon}
                    isOpen={isOpen}
                    isActive={location.pathname.includes(path)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-text-secondary">
              No navigation items available
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};
