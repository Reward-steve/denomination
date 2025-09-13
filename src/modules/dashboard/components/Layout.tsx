import Header from "../../../components/layout/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export default function DashboardLayout({
  children,
  disabled,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Header */}
      {!disabled && <Header />}

      {/* Page Content */}
      <main className="flex-1 w-full px-4 sm:px-4 py-6">{children}</main>
    </div>
  );
}
