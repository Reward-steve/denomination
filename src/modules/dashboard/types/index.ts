// Props for EventModal
export interface EventModalProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  handleModalClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  newEvent: Event;
  setNewEvent: (value: React.SetStateAction<Event>) => void;
  formError?: string | null;
  handleAddEvent: () => void;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
  firstInputRef?: React.RefObject<HTMLInputElement | null>;
}

export interface Event {
  id: number;
  name: string;
  venue: string;
  descr?: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm:ss"
  recurrent: boolean;
  schedule?: {
    nth?: "1st" | "2nd" | "3rd" | "4th" | "5th" | "last"; // only for monthly
    dateOfMonth?: number; // only for monthly
    weekday?: string; // "Monday", "Tuesday", etc.
    day?: string; // "3rd Sunday", "15", "Monday", etc.
    period: "daily" | "weekly" | "monthly" | "yearly" | string;
    month?: number; // only for yearly
  };
}

// Example events
export const initialEvents: Event[] = [
  {
    id: 1,
    name: "UCCA fasting and divine service",
    venue: "UCCA Church, Abak Uyo",
    descr: "Monthly gathering for fasting and fellowship.",
    date: "2025-09-24",
    time: "15:00:00",
    recurrent: true,
    schedule: {
      period: "monthly",
      day: "4th wednesday", // nth weekday of the month
    },
  },
  {
    id: 2,
    name: "UCCA End of the year get together",
    venue: "UCCA Church, Abak Uyo",
    descr: "Annual celebration — friends & family welcome.",
    date: "2025-12-31",
    time: "16:30:00",
    recurrent: true,
    schedule: {
      period: "yearly",
      day: "31", // day of the month
      month: 12, // December
    },
  },
];

// Dropdown options
export const scheduleOptions = [
  { id: "weekly", name: "Weekly" },
  { id: "monthly", name: "Monthly" },
  { id: "yearly", name: "Yearly" },
];

// Base weekdays (for weekly schedules)
export const dayOptions = [
  { id: "monday", name: "Monday" },
  { id: "tuesday", name: "Tuesday" },
  { id: "wednesday", name: "Wednesday" },
  { id: "thursday", name: "Thursday" },
  { id: "friday", name: "Friday" },
  { id: "saturday", name: "Saturday" },
  { id: "sunday", name: "Sunday" },
];

// Fixed times mapped to backend "HH:MM:SS"
export const timeOptions = [
  { id: "08:00:00", name: "Morning (08:00 AM)" },
  { id: "13:00:00", name: "Afternoon (01:00 PM)" },
  { id: "18:00:00", name: "Evening (06:00 PM)" },
];
