import { MdEdit } from "react-icons/md";
import { FaTrash, FaClock, FaRepeat } from "react-icons/fa6";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Button } from "../../../../../components/ui/Button";

export const AnncCard = ({ data, onEdit, onDelete }: any) => {
  return (
    <article
      className="p-5 rounded-2xl bg-surface border border-border 
                 hover:border-accent transition duration-200 space-y-1"
      role="region"
      aria-labelledby={`event-title-${data.id}`}
    >
      <h3
        id={`event-title-${data.id}`}
        className="text-lg font-bold text-text truncate"
      >
        {data.title || "Untitled Event"}
      </h3>

      <div className="text-sm text-text-secondary">
        {data.body || "Untitled Event"}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          textSize="xs"
          size="sm"
          onClick={() => onEdit(data)}
          aria-label={`Edit event: ${data.title || "Untitled"}`}
        >
          <MdEdit className="text-accent" />
        </Button>
        {data.id && (
          <Button
            variant="outline"
            textSize="xs"
            size="sm"
            onClick={() => onDelete(data.id!)}
            aria-label={`Delete event: ${data.title || "Untitled"}`}
          >
            <FaTrash className="text-error" />
          </Button>
        )}
      </div>
    </article>
  );
};
