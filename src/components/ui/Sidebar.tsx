import { useLocation, useNavigate } from "react-router-dom";
import { LuPanelRightClose, LuPanelRightOpen } from "react-icons/lu";
import { useState } from "react";
import Logo from "./Logo";

export interface SidebarPros {
  label: string;
  Icon?: IconType | string;
  path: string;
  step?: number;
}

import { useRegistration } from "../../hooks/useReg";
import { FaCircleCheck } from "react-icons/fa6";
import type { IconType } from "react-icons";

type SidebarLinkProps = {
  to: string;
  label: string;
  num: number;
  Icon?: IconType | string;
  isOpen?: boolean;
  isActive?: boolean;
  disabled?: boolean;
};

export const SidebarLink = ({
  to,
  label,
  num,
  Icon,
  isActive,
  disabled,
  isOpen,
}: SidebarLinkProps) => {
  const { step } = useRegistration();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/${to}`);
  };
  const pathname = location.pathname.includes("dashboard");
  const adjust = isOpen ? "justify-start" : "justify-center";

  return (
    <button
      disabled={disabled}
      title={label}
      onClick={handleClick}
      className={`w-full text-left my-4 flex hover:bg-[#10B981]/20 ${
        pathname ? adjust : "justify-between"
      } items-center gap-3 p-2 rounded-md transition text-sm ${
        isActive && step === num ? "border-2 border-accent bg-white" : ""
      } ${num < step ? "bg-[#10B981]/40" : "bg-border"} ${
        pathname && isActive ? "bg-[#10B981]/40" : "bg-border"
      }`}
    >
      {Icon && <Icon className="text-lg" />}
      {isOpen && <span className="overflow-hidden">{label}</span>}
      {num < step ? <FaCircleCheck className="text-lg text-green-700" /> : ""}
    </button>
  );
};

export const SidebarDesktop = ({
  items,
  disabled,
}: {
  items: SidebarPros[];
  disabled?: boolean;
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const pathname = location.pathname.includes("auth");
  const sidebarBtn = isOpen ? <LuPanelRightOpen /> : <LuPanelRightClose />;

  // --- Desktop: Sidebar ---
  return (
    <>
      <aside
        role="navigation"
        className={`fixed h-screen md:w-64 top-0 left-0 z-40 md:p-2 transition-all duration-500 md:relative md:translate-x-0 ${
          isOpen ? "md:w-64" : "md:w-20"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <div className="h-full min:h-screen p-2 w-full md:rounded-md border border-border rounded-none flex flex-col justify-between">
          {/* Top Section: Logo and Toggle */}
          <div className="flex flex-col static">
            <div
              className={`flex items-center ${
                isOpen ? "justify-between" : "justify-center"
              } mb-6`}
            >
              <Logo isCollapsed={!isOpen} />
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle sidebar"
                className="text-md p-2 rounded  hover:bg-white hover:text-accent transition"
              >
                {!pathname && sidebarBtn}
              </button>
            </div>

            <ul className="space-y-1">
              {items.map(({ label, Icon, path, step }) => (
                <li key={label}>
                  <SidebarLink
                    to={path}
                    label={label}
                    num={step!}
                    disabled={disabled}
                    Icon={Icon ? Icon : ""}
                    isOpen={isOpen}
                    isActive={location.pathname.includes(path)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
};
