import { type Event as AppEvent, type Event } from "../types";

// Helper to get the ordinal suffix for any number
function getOrdinalSuffix(num: number): string {
  if (typeof num !== "number" || Number.isNaN(num)) return String(num);

  const j = num % 10;
  const k = num % 100;

  if (k >= 11 && k <= 13) return `${num}th`; // exceptions: 11th, 12th, 13th

  switch (j) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
}

// Get the weekday name from a Date or string
function getWeekdayName(date: string | Date): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
    return "Invalid Date";
  }

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return weekdays[parsedDate.getDay()];
}

// Calculate nth weekday of the month (e.g., 1st Monday, 3rd Thursday)
function getNthWeekday(date: Date): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = date.getDay(); // 0 = Sunday
  const weekNumber = Math.ceil(date.getDate() / 7); // 1st week = 1, etc.
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return `${getOrdinalSuffix(weekNumber)} ${weekdays[day]}`;
}

const getMonthName = (month: number) =>
  new Date(0, month - 1).toLocaleString(undefined, { month: "long" });

const getRecurrenceText = (event: Event): string => {
  if (!event.recurrent || !event.schedule) return "";

  const { period, day, nth, weekday, month } = event.schedule;
  const monthStr = month ? ` ${getMonthName(month)}` : "";

  switch (period) {
    case "weekly":
      return `Repeats every ${weekday ?? "week"}`;
    case "monthly":
      if (day) return `Repeats on the ${day} of each month`;
      if (nth && weekday) return `Repeats every ${nth} ${weekday} of the month`;
      return "Repeats monthly";
    case "yearly":
      return day
        ? `Repeats yearly on ${day}${monthStr}`
        : month
        ? `Repeats yearly in ${monthStr}`
        : "Repeats yearly";
    default:
      return "";
  }
};

const mapApiEventToEvent = (apiEvent: any): AppEvent => ({
  id: apiEvent.id || 0,
  name: apiEvent.name || "",
  venue: apiEvent.venue || "",
  descr: apiEvent.descr || "",
  date: apiEvent.date || "",
  time: apiEvent.time || "",
  recurrent: apiEvent.recurrent === "1",
  schedule: {
    period: apiEvent.schedule || "weekly",
    day: apiEvent.day || "",
    month: apiEvent.month ? Number(apiEvent.month) : undefined,
  },
});

// --- Helpers: robust chronological sort ---
const toTimestamp = (ev: AppEvent) => {
  // Build ISO-like string when possible; gracefully fallback
  try {
    const datePart = ev.date ?? "";
    const timePart = (ev.time ?? "00:00").slice(0, 5); // "HH:MM"
    const ts = new Date(`${datePart}T${timePart}`).getTime();
    return Number.isFinite(ts) ? ts : Number.MAX_SAFE_INTEGER;
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
};

function formatTimeToAMPM(timeStr: string): string {
  const [hoursStr, minutesStr] = timeStr.split(":");
  if (!hoursStr || !minutesStr) return "Invalid time";

  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  if (isNaN(hours) || isNaN(minutes)) return "Invalid time";

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 => 12
  const minutesPadded = minutes.toString().padStart(2, "0");

  return `${hours}:${minutesPadded} ${ampm}`;
}

function normalizeTime(time: string): string {
  // if already includes seconds, return as-is
  if (time.split(":").length === 3) return time;

  // if it's just HH:mm, append :00
  return `${time}:00`;
}

const sortEvents = (list: AppEvent[]) =>
  [...list].sort((a, b) => toTimestamp(a) - toTimestamp(b));

export {
  getRecurrenceText,
  normalizeTime,
  formatTimeToAMPM,
  mapApiEventToEvent,
  getOrdinalSuffix,
  getWeekdayName,
  getNthWeekday,
  sortEvents,
  toTimestamp,
};
