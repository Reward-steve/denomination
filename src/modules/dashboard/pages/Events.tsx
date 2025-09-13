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
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: "",
    date: "",
    description: "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  // refs for accessibility & focus management
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  /* Focus first input when modal opens and prevent body scroll */
  useEffect(() => {
    if (showModal) {
      firstInputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

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
    // basic validation
    if (!newEvent.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!newEvent.date) {
      setFormError("Date is required.");
      return;
    }

    const next: Event = {
      ...newEvent,
      id: Date.now(), // simple unique id
      title: newEvent.title.trim(),
    };

    setEvents((prev) => [next, ...prev]); // newest first
    setNewEvent({ id: 0, title: "", date: "", description: "" });
    setFormError(null);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    // naive delete with confirm (you can replace with nicer UI)
    if (!confirm("Are you sure you want to delete this event?")) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEdit = (event: Event) => {
    // Simple "edit in modal" behavior: populate form and open modal
    setNewEvent(event);
    setShowModal(true);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    // close modal when clicking on the overlay background
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
                setNewEvent({ id: 0, title: "", date: "", description: "" });
                setFormError(null);
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
      {showModal && (
        <EventModal
          modalRef={modalRef}
          handleModalClick={handleModalClick}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          formError={formError}
          handleAddEvent={handleAddEvent}
          setShowModal={setShowModal}
          firstInputRef={firstInputRef}
        />
      )}
    </DashboardLayout>
  );
}
