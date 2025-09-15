import { useState, useCallback, useMemo, useRef } from "react";
import { type Event } from "../types";
import { getNthWeekday } from "../utils/Helper";

interface UseEventModalProps {
  handleAddEvent: (event: Event) => void;
  initialEvent?: Event;
}

export const useEventModal = ({
  handleAddEvent,
  initialEvent,
}: UseEventModalProps) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Base empty event structure
  const emptyEvent: Event = useMemo(
    () =>
      initialEvent ?? {
        id: 0,
        name: "",
        venue: "",
        descr: "",
        date: "",
        time: "",
        recurrent: false,
        schedule: { period: "", day: "" },
      },
    [initialEvent]
  );

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Event>(emptyEvent);

  // Open modal with optional event (edit) or new event
  const openModal = useCallback(
    (event?: Event) => {
      setNewEvent(
        event ?? { ...emptyEvent, schedule: { period: "daily", day: "" } }
      );
      setShowModal(true);
    },
    [emptyEvent]
  );

  // Close modal and reset state
  const closeModal = useCallback(() => {
    setNewEvent(emptyEvent);
    setShowModal(false);
  }, [emptyEvent]);

  // Normalize time & recurring schedule, then submit
  const submitEvent = useCallback(
    (event: Event) => {
      if (!event.name || !event.date || !event.time) {
        alert("Please fill in the event name, date, and time.");
        return;
      }

      const [hours, minutes] = event.time.split(":");
      const normalizedTime = `${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )}:00`;
      const parsedDate = new Date(event.date + "T" + normalizedTime);

      let scheduleForPayload: Event["schedule"] | undefined = undefined;
      if (event.recurrent) {
        const period = event.schedule?.period;
        if (period === "weekly") {
          scheduleForPayload = { period: "weekly", day: event.schedule?.day };
        } else if (period === "monthly") {
          const dayVal =
            event.schedule?.dateOfMonth ??
            (event.schedule?.nth && event.schedule?.weekday
              ? `${event.schedule.nth} ${event.schedule.weekday}`
              : getNthWeekday(parsedDate));
          scheduleForPayload = { period: "monthly", day: String(dayVal) };
        } else if (period === "yearly") {
          scheduleForPayload = {
            period: "yearly",
            day: String(parsedDate.getDate()),
            month: parsedDate.getMonth() + 1,
          };
        } else if (period === "daily") {
          scheduleForPayload = { period: "daily" };
        }
      }

      const payload: Event = {
        ...event,
        time: normalizedTime,
        schedule: scheduleForPayload,
        id: event.id && event.id !== 0 ? event.id : Date.now(),
      };

      setNewEvent(payload);
      handleAddEvent(payload);
      setShowModal(false);
    },
    [handleAddEvent]
  );

  return {
    modalRef,
    showModal,
    newEvent,
    setNewEvent,
    openModal,
    closeModal,
    submitEvent,
  };
};
