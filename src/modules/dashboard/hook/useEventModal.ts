import { useState, useCallback, useMemo, useRef } from "react";
import type { Event as AppEvent } from "../types";
import { getNthWeekday } from "../utils/Helper";
import { createEvent } from "../services/events";

interface UseEventModalProps {
  initialEvent?: AppEvent;
  handleAddEvent?: (fresh: AppEvent) => void;
}

export const useEventModal = ({ initialEvent }: UseEventModalProps = {}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);

  /** Default/empty event */
  const emptyEvent: AppEvent = useMemo(
    () =>
      initialEvent ?? {
        id: 0,
        name: "",
        venue: "",
        descr: "",
        date: "",
        time: "",
        recurrent: false,
        schedule: undefined, // ✅ no schedule unless recurrent is true
      },
    [initialEvent]
  );

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<AppEvent>(emptyEvent);

  /** Open modal with an existing or fresh event */
  const openModal = useCallback(
    (event?: AppEvent) => {
      setNewEvent(event ?? { ...emptyEvent });
      setShowModal(true);
    },
    [emptyEvent]
  );

  /** Close modal and reset event */
  const closeModal = useCallback(() => {
    setNewEvent(emptyEvent);
    setShowModal(false);
  }, [emptyEvent]);

  /** Submit event and return the created AppEvent */
  const submitEvent = useCallback(
    async (event: AppEvent): Promise<AppEvent | null> => {
      if (!event.name || !event.date || !event.time) {
        alert("Please fill in the event name, date, and time.");
        return null;
      }

      // ✅ Normalize time safely
      const timeParts = event.time.split(":");
      const hours = timeParts[0] || "00";
      const minutes = timeParts[1] || "00";
      const normalizedTime = `${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )}:00`;

      const parsedDate = new Date(`${event.date}T${normalizedTime}`);

      // ✅ Build recurrence schedule only when needed
      let scheduleForPayload: AppEvent["schedule"] | undefined;
      if (event.recurrent) {
        const period = event.schedule?.period;

        if (period === "weekly") {
          scheduleForPayload = {
            period: "weekly",
            day: event.schedule?.day || "",
          };
        } else if (period === "monthly") {
          // Ensure backend-friendly monthly format
          const dayVal = event.schedule?.day || getNthWeekday(parsedDate);
          scheduleForPayload = { period: "monthly", day: String(dayVal) };
        } else if (period === "yearly") {
          const dayOfMonth = parsedDate.getDate();
          const monthOfYear =
            event.schedule?.month ?? parsedDate.getMonth() + 1; // prefer dropdown month if set
          scheduleForPayload = {
            period: "yearly",
            day: String(dayOfMonth),
            month: monthOfYear,
          };
        }
      }

      // ✅ Build payload for API
      const payload: AppEvent = {
        ...event,
        ...(event.id && event.id !== 0 ? { id: event.id } : {}), // only include if valid
        time: normalizedTime,
        venue: event.venue || "TBA",
        descr: event.descr || "No description",
        date: event.date,
        schedule: scheduleForPayload,
      };

      try {
        const res = await createEvent(payload);
        if (!res || res.success === false) {
          throw new Error(res?.message || "Event creation failed");
        }

        setShowModal(false);
        return { ...payload, id: payload.id }; // ✅ use backend id if returned
      } catch (error) {
        console.error("Failed to create event:", error);
        alert("Failed to create event. Please try again.");
        return null;
      }
    },
    []
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
