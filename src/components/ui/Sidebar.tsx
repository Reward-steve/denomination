import { useLocation, useNavigate } from "react-router-dom";
import { useState, memo, useCallback, useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { LuPanelRightClose, LuPanelRightOpen } from "react-icons/lu";
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
import { useAuth } from "../../hooks/useAuth";

/* -------------------- Types -------------------- */
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
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/* -------------------- Header -------------------- */
const SidebarHeader = ({
  isOpen,
  toggleOpen,
  hideToggle,
}: {
  isOpen: boolean;
  toggleOpen: () => void;
  hideToggle: boolean;
}) => {
  const { isMobile } = useResponsive();
  const sidebarBtn = isOpen ? <LuPanelRightClose /> : <LuPanelRightOpen />;

  return (
    <div
      className={clsx(
        "flex items-center mb-6 transition-all duration-300",
        isOpen ? "justify-between" : "justify-center"
      )}
    >
      {/* Show logo only on desktop */}
      {!isMobile && <Logo isCollapsed={!isOpen} />}

      {!hideToggle && (
        <button
          onClick={toggleOpen}
          aria-label="Toggle sidebar"
          className="p-2 rounded text-text-secondary hover:bg-neutral/10 transition-colors"
        >
          {sidebarBtn}
        </button>
      )}
    </div>
  );
};

/* -------------------- Sidebar Link -------------------- */
export const SidebarLink = memo(
  ({
    to,
    label,
    num,
    Icon,
    isActive,
    disabled,
    isOpen,
    setIsOpen,
  }: SidebarLinkProps) => {
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
      setIsOpen(false);
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
        "bg-accent/20 text-accent": isDashboard && isActive,

        // Completed step
        "bg-accent/10 text-primary": !isActive && isStepCompleted,

        // Incomplete step
        "bg-smooth text-text-secondary": !isActive && !isStepCompleted,

        // Disabled state
        "cursor-not-allowed": disabled,

        // Default fallback
        "bg-transparent": isDashboard && !isActive,
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

/* -------------------- Responsive Sidebar -------------------- */
export const ResponsiveNav = ({
  items,
  disabled,
}: {
  items: (AuthSidebarProps | DashboardSidebarProps)[];
  disabled?: boolean;
}) => {
  const location = useLocation();
  const { isMobile } = useResponsive();
  const isAuthPage = location.pathname.includes("auth");

  const [isOpen, setIsOpen] = useState(!isMobile);
  const { user } = useAuth();
  const is_admin = user?.is_admin || false;

  // Sync open state when switching between mobile & desktop
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        role="navigation"
        aria-label="Main navigation"
        className={clsx(
          "fixed top-0 left-0 h-screen z-40 transition-all duration-300 bg-background md:relative",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isOpen
            ? "w-[var(--sidebar-width)]"
            : "w-[var(--sidebar-collapsed-width)]"
        )}
      >
        <div className="h-full bg-surface p-3 border-r border-border flex flex-col">
          {/* Header */}
          <SidebarHeader
            isOpen={isOpen}
            toggleOpen={() => setIsOpen((prev) => !prev)}
            hideToggle={isAuthPage}
          />

          {/* Links */}
          <nav className="flex-1 overflow-y-auto">
            {items.length > 0 ? (
              <ul className="space-y-1">
                {items.map(
                  ({ label, Icon, path, step, admin }) =>
                    ((!admin && !is_admin) || is_admin) && (
                      <li key={label}>
                        <SidebarLink
                          to={path}
                          label={
                            label === "Users" && !is_admin
                              ? "Executives"
                              : label
                          }
                          setIsOpen={setIsOpen}
                          num={step!}
                          disabled={disabled}
                          Icon={Icon}
                          isOpen={isOpen}
                          isActive={location.pathname.includes(path)}
                        />
                      </li>
                    )
                )}
              </ul>
            ) : (
              <p className="text-center text-text-secondary">
                No navigation items
              </p>
            )}
          </nav>
        </div>
      </aside>

      {!disabled && isMobile && (
        <button
          className="fixed top-2.5 left-4 z-50 p-2 rounded-md bg-surface text-text border border-border shadow-sm"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <LuPanelRightClose /> : <LuPanelRightOpen />}
        </button>
      )}
    </>
  );
};
