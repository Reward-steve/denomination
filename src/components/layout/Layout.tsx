import ResponsiveNav from "./Sidebar";
import { ResponsiveNavData } from "../../constant/sidebar";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useRef } from "react";

export default function Layout() {
  const { desktopItems, bottomItems, mobileItems } = ResponsiveNavData();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-screen bg-dashboard relative">
      {/* Sidebar */}
      <ResponsiveNav
        scrollContainerRef={scrollContainerRef}
        mobileItems={mobileItems}
        desktopItems={desktopItems}
        bottomItems={bottomItems}
      />

      <main
        ref={scrollContainerRef}
        style={{ scrollbarWidth: "none" }}
        className={`flex-1 transition-all duration-200 overflow-y-auto h-screen md:pr-2`}
      >
        <section className="w-full h-auto bg-dashboard min-h-screen">
          <Header />

          <div className="px-4 rounded-md bg-white h-auto min-h-svh animate-fade">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
