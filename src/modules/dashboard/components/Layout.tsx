import Header from "../../../components/layout/Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  disabled?: boolean;
}

const DashboardLayout = ({ children, disabled }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Top Header */}
      {!disabled && <Header />}

      {/* Page Content */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
