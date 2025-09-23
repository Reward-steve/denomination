import { Button } from "../../../components/ui/Button";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
}

export function DashboardHeader({
  title,
  description,
  actionLabel,
  onAction,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-6 animate-fade">
      {/* Header */}
      <div className="backdrop-blur-md py-4">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text capitalize">{title}</h1>
            {description && (
              <p className="text-text-placeholder mt-1">{description}</p>
            )}
          </div>

          {actionLabel && onAction && (
            <Button
              variant="primary"
              size="md"
              onClick={onAction}
              className="gap-2"
            >
              {actionLabel}
            </Button>
          )}
        </header>
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
}
