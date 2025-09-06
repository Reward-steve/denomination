// pages/admin/settings/Settings.tsx
import { Outlet, useLocation } from "react-router-dom";
import { useResponsive } from "../../../hooks/useResponsive";
import SettingsSidebar from "./Sidebar";

export default function Settings() {
  const { isMobile } = useResponsive();
  const location = useLocation();

  const activeSetting = location.pathname.split("/auth/")[1];
  const isSettingSelected = Boolean(activeSetting);

  if (isMobile) {
    return (
      <div className="min-h-screen">
        {isSettingSelected ? <Outlet /> : <SettingsSidebar />}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white relative">
      <SettingsSidebar />

      <main
        style={{ scrollbarWidth: "none" }}
        className={`flex-1 transition-all duration-200 overflow-y-auto h-screen md:pr-2`}
      >
        <section className="w-full h-auto bg-white min-h-screen">
          <div className="px-4 h-auto min-h-svh animate-fade">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
