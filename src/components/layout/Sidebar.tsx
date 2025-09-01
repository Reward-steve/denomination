import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../ui/Logo";
import { SidebarLink } from "./SidebarLink";
import { type SidebarItem } from "../../types/ui.types"; // Ensure this is defined
import { useResponsive } from "../../hooks/useResponsive";
import { LuPanelRightClose, LuPanelRightOpen } from "react-icons/lu";

type ResponsiveNavProps = {
  desktopItems: SidebarItem[];
  mobileItems: SidebarItem[];
  bottomItems?: SidebarItem[];
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
};

export default function ResponsiveNav({
  desktopItems,
  mobileItems,
  scrollContainerRef,
  bottomItems = [],
}: ResponsiveNavProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { isMobile } = useResponsive();
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const prevScrollRef = useRef(0);
  const [showBottomNav, setShowBottomNav] = useState(true);

  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (!el) return;

    const handleScroll = () => {
      const current = el.scrollTop;
      const prev = prevScrollRef.current;

      setShowBottomNav(prev > current || current < 10);
      prevScrollRef.current = current;
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

  // --- Mobile: Bottom Nav ---
  if (isMobile) {
    return (
      <nav
        className={`fixed backdrop-blur-xl border-border bottom-0 left-0 w-full bg-background shadow-lg border-t flex justify-around py-2 z-50 transition-transform duration-300 ${
          showBottomNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {mobileItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname.includes(path);
          return (
            <Link
              to={path}
              key={label}
              title={label}
              className={`flex flex-col items-center text-xs ${
                isActive ? "text-primary" : "text-subText"
              }`}
            >
              <Icon className="text-xl mb-1" />
              {label}
            </Link>
          );
        })}
      </nav>
    );
  }

  // --- Desktop: Sidebar ---
  return (
    <>
      <aside
        role="navigation"
        className={`${
          isSidebarOpen ? "md:w-64" : "md:w-20"
        } top-0 left-0 z-40 md:p-2 transition-all duration-500 md:relative md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed
        h-screen
  `}
      >
        <div className="bg-[#BED6FF4D] h-full min:h-screen p-2 w-full md:rounded-md rounded-none flex flex-col justify-between">
          {/* Top Section: Logo and Toggle */}
          <div className="flex flex-col static">
            <div
              className={`flex items-center ${
                isSidebarOpen ? "justify-between" : "justify-center"
              } mb-6`}
            >
              <Logo isCollapsed={!isSidebarOpen} />
              <button
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
                className="text-md p-2 rounded  hover:bg-white hover:text-primary transition"
              >
                {isSidebarOpen ? <LuPanelRightOpen /> : <LuPanelRightClose />}
              </button>
            </div>

            <ul className="space-y-1">
              {desktopItems.map(({ label, icon: Icon, path }) => (
                <li key={label}>
                  <SidebarLink
                    to={path}
                    icon={Icon}
                    label={label}
                    isOpen={isSidebarOpen}
                    isActive={location.pathname.includes(path)}
                  />
                </li>
              ))}
            </ul>
          </div>
          {/* Bottom Items */}
          <ul className="space-y-0 border-border border-t pt-4 mt-6">
            {bottomItems.map(({ label, icon: Icon, path }) => (
              <li key={label}>
                <SidebarLink
                  to={path}
                  icon={Icon}
                  label={label}
                  isOpen={isSidebarOpen}
                  isActive={location.pathname.includes(path)}
                />
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
