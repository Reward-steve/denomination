import { FaX } from "react-icons/fa6";
import { Button } from "../../../components/ui/Button";
import type { EventModalProps } from "../types";

export const EventModal = ({
  modalRef,
  handleModalClick,
  newEvent,
  setNewEvent,
  formError,
  handleAddEvent,
  setShowModal,
  firstInputRef,
}: EventModalProps) => {
  return (
    <div
      ref={modalRef}
      onClick={handleModalClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
    >
      <div
        className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2
            id="event-modal-title"
            className="text-xl font-semibold text-text"
          >
            {newEvent.id ? "Edit Event" : "Add New Event"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 rounded-full hover:bg-background/70 transition-colors"
            aria-label="Close modal"
          >
            <FaX size={14} className="text-primary" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddEvent();
          }}
          className="space-y-4"
        >
          {/* Title */}
          <div>
            <label
              className="block text-sm mb-1 text-text-placeholder"
              htmlFor="event-title"
            >
              Title <span className="text-error">*</span>
            </label>
            <input
              id="event-title"
              ref={firstInputRef}
              type="text"
              placeholder="Event Title"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent((s) => ({ ...s, title: e.target.value }))
              }
              required
            />
          </div>

          {/* Date */}
          <div>
            <label
              className="block text-sm mb-1 text-text-placeholder"
              htmlFor="event-date"
            >
              Date <span className="text-error">*</span>
            </label>
            <input
              id="event-date"
              type="date"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-accent"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent((s) => ({ ...s, date: e.target.value }))
              }
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              className="block text-sm mb-1 text-text-placeholder"
              htmlFor="event-desc"
            >
              Description
            </label>
            <textarea
              id="event-desc"
              placeholder="Optional description"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent((s) => ({ ...s, description: e.target.value }))
              }
            />
          </div>

          {/* Validation error */}
          {formError && (
            <p className="text-sm text-error font-medium">{formError}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {newEvent.id ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
