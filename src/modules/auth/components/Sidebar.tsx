import { useLocation, useNavigate } from "react-router-dom";

import { type JSX } from "react";
import Logo from "../../../components/ui/Logo";

export interface SettingsSidebar {
  label: string;
  icon?: JSX.Element;
  path: string;
  step: number;
}

const desktopMenue: SettingsSidebar[] = [
  {
    label: "Personal Information",
    path: "personal-info",
    step: 1,
  },
  { label: "Education Data", path: "education-data", step: 2 },
  { label: "Next of Kin", path: "next-of-kin", step: 3 },
  { label: "UCCA Information", path: "ucca-info", step: 4 },
  { label: "Previous Position", path: "prev-position", step: 5 },
];

import { useRegistration } from "../../../hooks/useReg";
import { FaCircleCheck } from "react-icons/fa6";

type SidebarLinkProps = {
  to: string;
  label: string;
  num: number;
  isOpen?: boolean;
  isActive?: boolean;
};

export const SidebarLink = ({ to, label, num, isActive }: SidebarLinkProps) => {
  const { step } = useRegistration();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/auth/${to}`);
  };

  return (
    <button
      // disabled={true}
      title={label}
      onClick={handleClick}
      className={`w-full text-left my-4 flex justify-between items-center gap-3 p-2 rounded-md transition text-sm ${
        isActive && step === num ? "border-2 border-green-500 bg-white" : ""
      } ${num < step ? "bg-green-200" : "bg-border"}`}
    >
      <span>{label}</span>
      {num < step ? <FaCircleCheck className="text-lg text-green-700" /> : ""}
    </button>
  );
};

export const SidebarDesktop = ({ items }: { items: SettingsSidebar[] }) => {
  const location = useLocation();

  // --- Desktop: Sidebar ---
  return (
    <>
      <aside
        role="navigation"
        className={`fixed h-screen md:w-64 top-0 left-0 z-40 md:p-2 transition-all duration-500 md:relative md:translate-x-0
      "translate-x-0"   
       
  `}
      >
        <div className="h-full min:h-screen p-2 w-full md:rounded-md border border-border rounded-none flex flex-col justify-between">
          {/* Top Section: Logo and Toggle */}
          <div className="flex flex-col static">
            <div className={`flex items-center ${"justify-between"} mb-6`}>
              <Logo />
              <button
                // onClick={toggleSidebar}
                aria-label="Toggle sidebar"
                className="text-md p-2 rounded  hover:bg-white hover:text-primary transition"
              ></button>
            </div>

            <ul className="space-y-1">
              {items.map(({ label, path, step }) => (
                <li key={label}>
                  <SidebarLink
                    to={path}
                    label={label}
                    num={step}
                    // isOpen={isSidebarOpen}
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

export default function SettingsSidebar() {
  return <SidebarDesktop items={desktopMenue} />;
}
