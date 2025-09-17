import { useState, useCallback, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { Button } from "../../../components/ui/Button";
import { FaCalendarPlus, FaCalendarAlt } from "react-icons/fa";
import DashboardLayout from "../components/Layout";
import { type Event as AppEvent } from "../types";
import { EventCard } from "../components/EventCard";
import { EventModalWrapper } from "../components/EventModal";
import { useEventModal } from "../hook/useEventModal";
import { deleteEvent, fetchAllEvents, updateEvent } from "../services/intex";
import { mapApiEventToEvent, normalizeTime, sortEvents } from "../utils/Helper";
import { toast } from "react-toastify";

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

  /** ---------- Modal Hook ---------- */
  const { modalRef, showModal, newEvent, openModal, closeModal, submitEvent } =
    useEventModal({
      handleAddEvent: (fresh: AppEvent) =>
        setEvents((prev) => (fresh ? [fresh, ...prev] : prev)),
    });

  /** ---------- Fetch Events ---------- */
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAllEvents();
      if (res?.status && Array.isArray(res.data)) {
        const mapped = res.data.map(mapApiEventToEvent);
        setEvents(sortEvents(mapped));
      } else {
        toast.error("Failed to load events.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Could not fetch events. Please try again.");
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
        />
      )),
    [events, handleEditEvent, handleDeleteEvent]
  );

  /** ---------- Render ---------- */
  return (
    <DashboardLayout>
      <main className="max-w-6xl mx-auto space-y-8 lg:py-8 py-6">
        {/* Header */}
        <section className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-accent text-2xl" />
            <h1 className="text-xl sm:text-2xl font-bold text-text">Events</h1>
          </div>

          <Button
            variant="primary"
            textSize="xs"
            className="gap-2"
            onClick={() => openModal()}
          >
            <FaCalendarPlus /> Add Event
          </Button>
        </section>

        {/* Events List */}
        <section>
          {loading && events.length === 0 ? (
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <p className="text-text-placeholder">No events available.</p>
              <Button variant="primary" size="sm" onClick={() => openModal()}>
                Add Your First Event
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">{renderedEvents}</div>
          )}
        </section>

        {/* Modal */}
        {showModal &&
          ReactDOM.createPortal(
            <EventModalWrapper
              modalRef={modalRef}
              handleModalClick={(e) => {
                if (e.target === modalRef.current) closeModal();
              }}
              event={newEvent}
              submitEvent={handleSubmitEvent}
              closeModal={closeModal}
            />,
            document.body
          )}
      </main>
    </DashboardLayout>
  );
}
