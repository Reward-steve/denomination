import { FaHardHat } from "react-icons/fa";
import { Button } from "./Button";

interface UnderConstructionProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const UnderConstruction = ({
  title = "Page Under Construction",
  description = "We're working hard to bring this feature to life. Check back soon!",
  actionLabel = "Go Home",
  onAction,
  icon = <FaHardHat className="w-20 h-20 text-primary/70 animate-bounce" />, // 👈 default icon
}: UnderConstructionProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 space-y-6">
      {/* Icon */}
      <div className="flex items-center justify-center">{icon}</div>

      {/* Text */}
      <div className="space-y-2 max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">{title}</h1>
        <p className="text-text-placeholder text-base sm:text-lg">
          {description}
        </p>
      </div>

      {/* Action */}
      {onAction && (
        <Button
          variant="primary"
          size="md"
          onClick={onAction}
          className="shadow-lg hover:shadow-xl transition-all"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
