import clsx from "classnames";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen text-text transition-colors duration-300">
      {/* Main Content */}
      <main className={clsx("flex-1 py-6 transition-all duration-300")}>
        <div className="rounded-xl border border-border animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
};
