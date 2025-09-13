import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { FaCalendarPlus, FaCalendarAlt } from "react-icons/fa";
import clsx from "clsx";
import DashboardLayout from "../components/Layout";

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

/* ---------------- Event Card ---------------- */
const EventCard = ({ title, date, description }: Event) => (
  <div
    className={clsx(
      "p-6 rounded-2xl bg-surface shadow-md",
      "hover:shadow-lg hover:bg-surface/90 transition-all duration-200 animate-fade"
    )}
  >
    <h3 className="text-lg font-semibold text-text">{title}</h3>
    <p className="text-sm text-text-placeholder">{date}</p>
    <p className="mt-2 text-text">{description}</p>
  </div>
);

export default function Events() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Leadership Summit",
      date: "2025-09-20",
      description: "Annual gathering of all coordinators and leaders.",
    },
    {
      id: 2,
      title: "Community Outreach",
      date: "2025-09-25",
      description: "Charity event for local communities.",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>({
    id: 0,
    title: "",
    date: "",
    description: "",
  });

  /* Close modal with Esc key */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return; // validation
    setEvents([...events, { ...newEvent, id: events.length + 1 }]);
    setNewEvent({ id: 0, title: "", date: "", description: "" });
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <section className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-text flex items-center gap-2">
            <FaCalendarAlt className="text-accent" /> Events
          </h1>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <FaCalendarPlus /> Add Event
          </Button>
        </section>

        {/* Events List */}
        <section className="grid gap-4 sm:grid-cols-2">
          {events.length > 0 ? (
            events.map((event) => <EventCard key={event.id} {...event} />)
          ) : (
            <p className="text-center col-span-full text-text-placeholder py-8">
              No events available. Start by adding one.
            </p>
          )}
        </section>
      </main>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade">
            <h2 className="text-xl font-semibold text-text mb-4">
              Add New Event
            </h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddEvent();
              }}
            >
              <div>
                <label className="block text-sm mb-1 text-text-placeholder">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Event Title"
                  className="w-full p-2 border rounded-lg bg-background text-text focus:ring-2 focus:ring-accent"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-text-placeholder">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-lg bg-background text-text focus:ring-2 focus:ring-accent"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-text-placeholder">
                  Description
                </label>
                <textarea
                  placeholder="Event Description"
                  className="w-full p-2 border rounded-lg bg-background text-text focus:ring-2 focus:ring-accent"
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, description: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
