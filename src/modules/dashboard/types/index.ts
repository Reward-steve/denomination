export interface Event {
  id: number;
  title: string;
  date: string; // ISO date or friendly string
  description?: string;
}

export interface EventModalProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  handleModalClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  newEvent: Event;
  setNewEvent: (value: React.SetStateAction<Event>) => void;
  formError: string | null;
  handleAddEvent: () => void;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
  firstInputRef: React.RefObject<HTMLInputElement | null>;
}

export const initialEvents: Event[] = [
  {
    id: 1,
    title: "UCCA fasting and divine service",
    date: "Monthly — 24 @ 3:00pm",
    description: "Monthly gathering for fasting and fellowship.",
  },
  {
    id: 2,
    title: "UCCA End of the year get together",
    date: "Yearly — December 31st @ 4:30pm",
    description: "Annual celebration — friends & family welcome.",
  },
];
