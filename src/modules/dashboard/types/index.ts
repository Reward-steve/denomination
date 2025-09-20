// Props for EventModal
export interface EventModalProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  handleModalClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  newEvent: Event;
  setNewEvent: (value: React.SetStateAction<Event>) => void;
  formError?: string | null;
  handleAddEvent: (event: Event) => void;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
  firstInputRef?: React.RefObject<HTMLInputElement | null>;
}

// Define allowed values for visibility
export type Visibility = "public" | "private" | "admins";

// Main interface
export interface DocumentFile {
  document: string[]; // array of file paths
  type: "song" | "video" | "document" | string; // can extend if more types
  size: number; // in bytes
  uploadedAt: string; // ISO date string
  uploadedBy?: string; // user ID or name
  id?: number; // optional, for existing documents
  name: string;
  descr?: string; // optional
  visibility: Visibility;
}

export interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

export interface Event {
  id?: number;
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
    period: "weekly" | "monthly" | "yearly";
    month?: number; // only for yearly
  };
}

// Dropdown options
export const scheduleOptions = [
  { id: "weekly", name: "Weekly" },
  { id: "monthly", name: "Monthly" },
  { id: "yearly", name: "Yearly" },
];

// Base weekdays (for weekly schedules)
export const dayOptions = [
  { id: "Monday", name: "Monday" },
  { id: "Tuesday", name: "Tuesday" },
  { id: "Wednesday", name: "Wednesday" },
  { id: "Thursday", name: "Thursday" },
  { id: "Friday", name: "Friday" },
  { id: "Saturday", name: "Saturday" },
  { id: "Sunday", name: "Sunday" },
];

export const monthOptions = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];
