import { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { Button } from "../../../components/ui/Button";
import { FaCalendarPlus, FaCalendarAlt } from "react-icons/fa";
import DashboardLayout from "../components/Layout";
import { initialEvents, type Event } from "../types";
import { EventCard } from "../components/EventCard";
import { EventModalWrapper } from "../components/EventModal";
import { useEventModal } from "../hook/useEventModal";

export default function Events() {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const handleAddEvent = useCallback((event: Event) => {
    setEvents((prev) =>
      [...prev.filter((e) => e.id !== event.id), event].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      })
    );
  }, []);

  const {
    modalRef,
    showModal,
    newEvent,
    setNewEvent,
    openModal,
    closeModal,
    submitEvent,
  } = useEventModal({
    handleAddEvent,
  });

  const handleDeleteEvent = useCallback((id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // const handleEditEvent = useCallback(
  //   (event: Event) => openModal(event),
  //   [openModal]
  // );

  const handleEditEvent = useCallback(
    (event: Event) => {
      setNewEvent(event);
      openModal(event);
    },
    [setNewEvent, openModal]
  );

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

        {/* Events Grid */}
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
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          )}
        </section>

        {/* Modal Portal */}
        {showModal &&
          ReactDOM.createPortal(
            <EventModalWrapper
              modalRef={modalRef}
              handleModalClick={(e) => {
                if (e.target === modalRef.current) closeModal();
              }}
              event={newEvent}
              submitEvent={submitEvent}
              closeModal={closeModal}
            />,
            document.body
          )}
      </main>
    </DashboardLayout>
  );
}
