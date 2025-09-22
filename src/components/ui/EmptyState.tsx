import { FaRegFolderOpen } from "react-icons/fa6";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No Items Found",
  description = "Looks like you haven’t added anything yet. Start by creating your first item.",
  icon = <FaRegFolderOpen className="w-16 h-16 text-primary/80" />,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border rounded-2xl overflow-hidden border-border bg-surface w-full">
      {/* Icon */}
      <div className="mb-6 flex items-center justify-center bg-primary/10 rounded-full p-6">
        {icon}
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-semibold text-text mb-2">
        {title}
      </h2>

      {/* Description */}
      <p className="text-text-secondary/70 max-w-md mb-6 text-sm sm:text-base">
        {description}
      </p>

      {/* Optional Action */}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
