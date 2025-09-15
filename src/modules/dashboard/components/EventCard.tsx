import { MdEdit } from "react-icons/md";
import { FaTrash, FaRepeat, FaCalendarDays, FaClock } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import type { Event } from "../types";

export const EventCard = ({
  event,
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: (e: Event) => void;
  onDelete: (id: number) => void;
}) => {
  // Ensure time is in HH:MM format
  const normalizedTime =
    event.time?.length === 5 ? event.time : event.time?.slice(0, 5) || "00:00";
  const parsedDate = new Date(`${event.date}T${normalizedTime}`);

  const dateString = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : event.date;

  const timeString = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    : event.time;

  // Format recurrence info
  let recurrence = "";
  if (event.recurrent && event.schedule) {
    const s = event.schedule as Event["schedule"];
    switch (s?.period) {
      case "daily":
        recurrence = "Daily";
        break;
      case "weekly":
        recurrence = `Weekly — ${s.day || "N/A"}`;
        break;
      case "monthly":
        if (s.day) {
          recurrence = `Monthly — ${s.day}`;
        } else if (s.nth && s.weekday) {
          recurrence = `Monthly — ${s.nth} ${s.weekday}`;
        } else {
          recurrence = "Monthly — N/A";
        }
        break;
      case "yearly":
        recurrence = `Yearly — ${s.day}${
          s.month ? ` (Month: ${s.month})` : ""
        }`;
        break;
      default:
        recurrence = "";
    }
  }

  return (
    <article className="p-4 rounded-xl bg-surface transition-colors duration-200 hover:shadow-sm hover:bg-surface/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-border">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-text">
          {event.name || "Unnamed Event"}
        </h3>

        <p className="text-xs text-text-placeholder flex items-center gap-1">
          <FaMapMarkerAlt className="text-sm" /> {event.venue || "No venue"}
        </p>

        <p className="text-xs text-text-placeholder flex items-center gap-2">
          <FaCalendarDays className="text-sm" /> {dateString}
          <FaClock className="text-sm ml-2" /> {timeString}
        </p>

        {recurrence && (
          <p className="text-xs text-text-placeholder flex items-center gap-1">
            <FaRepeat className="text-sm" /> {recurrence}
          </p>
        )}

        {event.descr && (
          <p className="mt-2 text-text-secondary text-sm">{event.descr}</p>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          textSize="xs"
          size="sm"
          onClick={() => onEdit(event)}
        >
          <MdEdit className="text-accent" />
        </Button>
        {event.id && (
          <Button
            variant="outline"
            textSize="xs"
            size="sm"
            onClick={() => onDelete(event.id)}
          >
            <FaTrash className="text-error" />
          </Button>
        )}
      </div>
    </article>
  );
};
