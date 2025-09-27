import { Outlet } from "react-router-dom";
import { useResponsive } from "../../hooks/useResponsive";
import { ResponsiveNav } from "../ui/Sidebar";
import type { AuthSidebarProps, DashboardSidebarProps } from "../../constant";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function Layout({
  Items,
  disabled,
}: {
  Items: (AuthSidebarProps | DashboardSidebarProps)[];
  disabled?: boolean;
}) {
  const { isMobile } = useResponsive();
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Update sidebar when switching screen size
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-background relative">
        <main
          style={{ scrollbarWidth: "none" }}
          className="flex-1 pb-16 transition-all duration-200 h-screen"
        >
          <section className="w-full h-auto bg-background min-h-screen">
            <div className="h-auto min-h-svh animate-fadeIn">
              <Outlet />
            </div>
          </section>
        </main>
        <ResponsiveNav items={Items} disabled={disabled} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <ResponsiveNav
        items={Items}
        disabled={disabled}
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main content */}
      <main
        className={clsx(
          "flex-1 transition-all duration-300",
          isSidebarOpen
            ? "ml-[var(--sidebar-width)]"
            : "ml-[var(--sidebar-collapsed-width)]"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
