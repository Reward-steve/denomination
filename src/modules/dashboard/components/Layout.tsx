import clsx from "classnames";
import Header from "../../../components/layout/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export const DashboardLayout = ({
  children,
  disabled,
}: DashboardLayoutProps) => {
  return (
    <>
      {!disabled && <Header />}
      <div className="min-h-screen text-text transition-colors duration-300">
        {/* Main Content */}
        <main className={clsx("flex-1 py-6 transition-all duration-300")}>
          <div className="rounded-xl border border-border animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};
