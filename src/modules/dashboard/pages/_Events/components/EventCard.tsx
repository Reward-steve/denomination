import { MdEdit } from "react-icons/md";
import { FaTrash, FaClock, FaRepeat } from "react-icons/fa6";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { Button } from "../../../../../components/ui/Button";
import type { EventCardProps } from "../../../types";
import { formatTimeToAMPM, getRecurrenceText } from "../../../utils/Helper";

export const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
  /** ---------- Date & Time ---------- */
  const parsedDate = event.date ? new Date(event.date) : null;
  const dateString =
    parsedDate && !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : null;

  const timeString = event.time ? formatTimeToAMPM(event.time) : null;
  const recurrenceText = getRecurrenceText(event);

  return (
    <article
      className="p-4 rounded-2xl bg-surface border border-border 
                 hover:border-accent transition duration-200 
                 space-y-2"
      role="region"
      aria-labelledby={`event-title-${event.id}`}
    >
      {/* Title */}
      <h3
        id={`event-title-${event.id}`}
        className="text-lg font-bold text-text"
      >
        {event.name || "Untitled Event"}
      </h3>

      {/* Core Details */}
      <div className="text-sm text-text-secondary space-y-2">
        {dateString && (
          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-accent shrink-0" />
            <span>{dateString}</span>
          </p>
        )}
        {timeString && (
          <p className="flex items-center gap-2">
            <FaClock className="text-accent shrink-0" />
            <span>{timeString}</span>
          </p>
        )}
        {event.venue && (
          <p className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-accent shrink-0" />
            <span>{event.venue}</span>
          </p>
        )}
        {recurrenceText && (
          <p className="flex items-center gap-2">
            <FaRepeat className="text-accent shrink-0" />
            <span>{recurrenceText}</span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          textSize="xs"
          size="sm"
          onClick={() => onEdit(event)}
          aria-label={`Edit event: ${event.name || "Untitled"}`}
        >
          <MdEdit className="text-accent" />
        </Button>
        {event.id && (
          <Button
            variant="outline"
            textSize="xs"
            size="sm"
            onClick={() => onDelete(event.id!)}
            aria-label={`Delete event: ${event.name || "Untitled"}`}
          >
            <FaTrash className="text-error" />
          </Button>
        )}
      </div>
    </article>
  );
};
