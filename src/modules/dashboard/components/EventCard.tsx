import { MdEdit } from "react-icons/md";
import { FaTrash, FaRepeat, FaCalendarDays, FaClock } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
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
      <div className="flex flex-col gap-1">
        {/* Event Name */}
        <h3
          id={`event-title-${event.id}`}
          className="text-lg font-semibold text-text"
        >
          {event.name}
        </h3>

        {/* Venue */}
        <p className="text-xs text-text-placeholder flex items-center gap-1">
          <FaMapMarkerAlt className="text-sm" /> {event.venue}
        </p>

        {/* Date & Time */}
        <p className="text-xs text-text-placeholder flex items-center gap-2">
          <FaCalendarDays className="text-sm" />
          {event.date}
          <FaClock className="text-sm ml-2" /> {event.time}
        </p>

        {/* Recurrence */}
        {event.recurrent && event.schedule && (
          <p className="text-xs text-text-placeholder flex items-center gap-1">
            <FaRepeat className="text-sm" /> {event.schedule.period} -{" "}
            {event.schedule.day}
            {event.schedule.period === "yearly" && event.schedule.month
              ? `, Month: ${event.schedule.month}`
              : ""}
          </p>
        )}

        {/* Description */}
        {event.descr && (
          <p className="mt-2 text-text-secondary text-sm">{event.descr}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          textSize="xs"
          size="sm"
          aria-label={`Edit ${event.name}`}
          onClick={() => onEdit(event)}
        >
          <MdEdit className="text-accent" />
        </Button>

        <Button
          variant="outline"
          textSize="xs"
          size="sm"
          aria-label={`Delete ${event.name}`}
          onClick={() => onDelete(event.id)}
        >
          <FaTrash className="text-error" />
        </Button>
      </div>
    </article>
  );
};
