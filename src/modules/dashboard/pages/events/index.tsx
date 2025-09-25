import { useState, useCallback, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { FaCalendarAlt } from "react-icons/fa";
import DashboardLayout from "../../components/Layout";
import { type Event as AppEvent } from "../../types";
import { EventCard } from "./components/EventCard";
import { EventModal } from "./components/EventModal";
import { useEventModal } from "../../hook/useEventModal";
import {
  deleteEvent,
  fetchAllEvents,
  updateEvent,
} from "../../services/events";
import {
  mapApiEventToEvent,
  normalizeTime,
  sortEvents,
} from "../../utils/Helper";
import { toast } from "react-toastify";
import { EmptyState } from "../../../../components/ui/EmptyState";
import { DashboardHeader } from "../../components/Header";
import { useNavigate } from "react-router-dom";

/** ---------- Skeleton Loader ---------- */
const EventCardSkeleton = () => (
  <div className="animate-pulse p-4 border border-border rounded-lg shadow-sm bg-muted">
    <div className="h-5 w-2/3 bg-surface rounded mb-2" />
    <div className="h-4 w-1/2 bg-surface rounded mb-1" />
    <div className="h-4 w-1/4 bg-surface rounded" />
  </div>
);

export default function Events() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /** ---------- Modal Hook ---------- */
  const { showModal, newEvent, openModal, closeModal, submitEvent } =
    useEventModal({
      handleAddEvent: (fresh: AppEvent) =>
        setEvents((prev) => (fresh ? [fresh, ...prev] : prev)),
    });

  /** ---------- Fetch Events ---------- */
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllEvents();
      if (Array.isArray(res.data)) {
        const mapped = res.data.map(mapApiEventToEvent);
        setEvents(sortEvents(mapped));
      } else {
        toast.error("Failed to load events.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Could not fetch events. Please try again." + err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /** ---------- Handlers ---------- */
  const handleDeleteEvent = useCallback(
    async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this event?"))
        return;

      try {
        const res = await deleteEvent(id);
        if (res?.success) {
          await fetchEvents();
          toast.success("Event deleted");
        } else {
          toast.error(res?.message || "Failed to delete event.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Could not delete event. Try again.");
      }
    },
    [fetchEvents]
  );

  const handleEditEvent = useCallback(
    (ev: AppEvent) => {
      const today = new Date().toISOString().split("T")[0];
      openModal({ ...ev, date: ev.date || today });
    },
    [openModal]
  );

  const updateExistingEvent = async (ev: AppEvent) => {
    const res = await updateEvent(ev.id!, {
      ...ev,
      time: normalizeTime(ev.time),
    });
    if (res?.success) {
      toast.success("Event updated successfully");
      await fetchEvents();
    } else {
      toast.error(res?.message || "Failed to update event.");
    }
  };

  const createNewEvent = async (ev: AppEvent) => {
    await submitEvent(ev);
    await fetchEvents();
  };

  const handleSubmitEvent = useCallback(
    async (ev: AppEvent) => {
      try {
        setLoading(true);
        if (ev.id) {
          await updateExistingEvent(ev);
        } else {
          await createNewEvent(ev);
        }
      } catch (err) {
        console.error("Save error:", err);
        toast.error("Failed to save event.");
      } finally {
        setLoading(false);
        closeModal();
      }
    },
    [fetchEvents, closeModal, submitEvent]
  );

  /** ---------- Memoized Events ---------- */
  const renderedEvents = useMemo(
    () =>
      events.map((ev) => (
        <EventCard
          key={ev.id ?? `${ev.name}-${ev.date}`}
          event={ev}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onClick={()=>  navigate(`/dashboard/events/${ev.id}/view`,{state: {event: ev}})}
        />
      )),
    [events, handleEditEvent, handleDeleteEvent]
  );

  /** ---------- Render ---------- */
  return (
    <DashboardLayout>
      <DashboardHeader
        title="Events"
        description="Stay on track and manage upcoming activities"
        actionLabel="Add Event"
        onAction={() => openModal()}
      >
        {/* Events List */}
        <div className="grid gap-4">
          {loading &&
            events.length === 0 &&
            Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}

          {!loading && events.length > 0 && renderedEvents}

          {!loading && events.length === 0 && (
            <EmptyState
              title="No Events Yet"
              description="You haven't created any events yet. Start by adding your first event to keep track of your schedule."
              icon={<FaCalendarAlt className="w-16 h-16 text-primary/80" />}
              actionLabel="Create Event"
              onAction={() => openModal()}
            />
          )}
        </div>

        {/* Modal */}
        {showModal &&
          ReactDOM.createPortal(
            <EventModal
              isOpen={showModal}
              onClose={closeModal}
              event={newEvent}
              submitEvent={handleSubmitEvent}
            />,
            document.body
          )}
      </DashboardHeader>
    </DashboardLayout>
  );
}
