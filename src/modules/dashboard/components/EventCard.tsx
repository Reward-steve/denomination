import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";
import { Button } from "../../../components/ui/Button";
import type { Event } from "../types";

/* ---------------- Event Card ----------------
   Small, reusable presentational card for an event.
   Buttons are wired to handlers passed from parent for extensibility.
*/
export const EventCard = ({
  event,
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: (e: Event) => void;
  onDelete: (id: number) => void;
}) => {
  return (
    <article
      className="p-4 rounded-xl bg-surface transition-colors duration-200 hover:shadow-sm hover:bg-surface/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-border"
      aria-labelledby={`event-title-${event.id}`}
    >
      <div>
        <h3
          id={`event-title-${event.id}`}
          className="text-lg font-semibold text-text"
        >
          {event.title}
        </h3>
        <p className="text-xs text-text-placeholder">{event.date}</p>
        {event.description && (
          <p className="mt-2 text-text-secondary text-sm">
            {event.description}
          </p>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          textSize="xs"
          size="sm"
          aria-label={`Edit ${event.title}`}
          onClick={() => onEdit(event)}
        >
          <MdEdit className="text-accent" />
        </Button>

        <Button
          variant="outline"
          textSize="xs"
          size="sm"
          aria-label={`Delete ${event.title}`}
          onClick={() => onDelete(event.id)}
        >
          <FaTrash className="text-error" />
        </Button>
      </div>
    </article>
  );
};
