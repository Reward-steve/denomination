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

export type MediaType = "document" | "song" | "sermon";

export interface BaseMedia {
  id: number;
  name: string;
  uploaded_by: string;
  created_at: string;
  type: MediaType;
  paths: string[];
}

export interface DocumentMedia extends BaseMedia {
  type: "document";
}

export interface SongMedia extends BaseMedia {
  type: "song";
  duration?: string;
}

export interface SermonMedia extends BaseMedia {
  type: "sermon";
  preacher?: string;
  descr?: string;
}

export type MediaResponse = DocumentMedia | SongMedia | SermonMedia;

export interface DocumentPayload {
  document: string[]; // file paths returned from fileUpload
  type: MediaType;
  name: string;
  descr?: string;
  visibility: "public" | "private" | "admins";
}

export interface DocumentResponse {
  id: number;
  name: string;
  descr?: string;
  type: MediaType;
  size?: number;
  uploaded_by: string;
  visibility: "public" | "private" | "admins";
  is_enabled: "0" | "1";
  created_at: string;
  updated_at: string;
  paths: string[];
}

export interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
  onClick?: () => void;
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

export type PaymentItem = {
  id: number; // Item identifier
  unit_price: number; // Price per unit
  units: number; // Quantity
  from: string; // ISO date string
  to: string; // ISO date string
  schedule?: 'yearly' | 'monthly' | 'once' | 'weekly'; // Item schedule description
};

export type InitPaymentRequest = {
  user_id: number; // User making the payment
  payment_method: "cash" | "online"; // Supported methods
  event_id: number; // Event related to the payment
  items: PaymentItem[]; // Array of payment items
};

export type FinanceStatsResponse = {
  status: boolean;
  message: string;
  data: {
    total_debts: number;
    dues_collected: number;
    welfare_collected: number;
    total_balance: number;
  };
};
