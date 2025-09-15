import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { FaCalendarPlus, FaCalendarAlt } from "react-icons/fa";
import DashboardLayout from "../components/Layout";
import { initialEvents, type Event } from "../types";
import { EventCard } from "../components/EventCard";
import { EventModal } from "../components/EventModal";

/* ---------------- Page ---------------- */
export default function Events() {
  // initial demo events
  const [events, setEvents] = useState<Event[]>(initialEvents);

  // modal state + form model
  const [showModal, setShowModal] = useState(false);

  // Define a reusable empty event object
  const emptyEvent: Event = {
    id: 0,
    name: "",
    venue: "",
    descr: "",
    date: "",
    time: "",
    recurrent: false,
    schedule: { period: "", day: "" },
  };

  // State
  const [newEvent, setNewEvent] = useState<Event>(emptyEvent);

  // modal ref for overlay click handling
  const modalRef = useRef<HTMLDivElement | null>(null);

  /* Prevent body scroll when modal opens */
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  /* Close modal with Escape key */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* ---------------- Handlers ---------------- */
  const handleAddEvent = () => {
    if (!newEvent) return;

    if (newEvent.id) {
      // update existing event
      setEvents((prev) =>
        prev.map((ev) => (ev.id === newEvent.id ? newEvent : ev))
      );
    } else {
      // create new event
      const next: Event = { ...newEvent, id: Date.now() };
      setEvents((prev) => [next, ...prev]); // newest first
    }

    setNewEvent(emptyEvent);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEdit = (event: Event) => {
    setNewEvent(event);
    setShowModal(true);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      setShowModal(false);
    }
  };

  /* ---------------- Render ---------------- */
  return (
    <DashboardLayout>
      <main className="max-w-6xl mx-auto space-y-8 lg:py-8 py-6">
        {/* Header */}
        <section className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-accent text-2xl" />
            <h1 className="text-xl sm:text-2xl font-bold text-text">Events</h1>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              textSize="xs"
              className="gap-2"
              onClick={() => {
                setNewEvent({
                  id: 0,
                  name: "",
                  venue: "",
                  descr: "",
                  date: "",
                  time: "",
                  recurrent: false,
                  schedule: { period: "", day: "" },
                });
                setShowModal(true);
              }}
            >
              <FaCalendarPlus /> Add Event
            </Button>
          </div>
        </section>

        {/* Events grid */}
        <section>
          {events.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-text-placeholder">
                No events available. Add your first event.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {events.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modal — Add / Edit Event */}
      {showModal && newEvent && (
        <EventModal
          modalRef={modalRef}
          handleModalClick={handleModalClick}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleAddEvent={handleAddEvent}
          setShowModal={setShowModal}
        />
      )}
    </DashboardLayout>
  );
}
