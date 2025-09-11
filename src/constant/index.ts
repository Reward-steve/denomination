import type { IconType } from "react-icons";
import { FaCoins, FaUser } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { TbCalendarEventFilled, TbHome2 } from "react-icons/tb";

// Interfaces
export interface AuthSidebarProps {
  label: string;
  path: string;
  step: number;
  Icon?: IconType;
}

export interface DashboardSidebarProps {
  label: string;
  path: string;
  Icon: IconType;
  step?: number;
}

export const relationships = [
  { id: "1", name: "Father" },
  { id: "2", name: "Mother" },
  { id: "3", name: "Son" },
  { id: "4", name: "Daughter" },
  { id: "5", name: "Brother" },
  { id: "6", name: "Sister" },
  { id: "7", name: "Grandfather" },
  { id: "8", name: "Grandmother" },
  { id: "9", name: "Grandson" },
  { id: "10", name: "Granddaughter" },
  { id: "11", name: "Uncle" },
  { id: "12", name: "Aunt" },
  { id: "13", name: "Nephew" },
  { id: "14", name: "Niece" },
  { id: "15", name: "Cousin" },
  { id: "16", name: "Spouse" }, // Husband / Wife
  { id: "17", name: "Fiancé/Fiancée" },
  { id: "18", name: "Stepfather" },
  { id: "19", name: "Stepmother" },
  { id: "20", name: "Stepson" },
  { id: "21", name: "Stepdaughter" },
  { id: "22", name: "Father-in-law" },
  { id: "23", name: "Mother-in-law" },
  { id: "24", name: "Son-in-law" },
  { id: "25", name: "Daughter-in-law" },
  { id: "26", name: "Brother-in-law" },
  { id: "27", name: "Sister-in-law" },
  { id: "28", name: "Guardian" },
  { id: "29", name: "Ward" },
  { id: "30", name: "Friend" },
  { id: "31", name: "Colleague" },
  { id: "32", name: "Mentor" },
  { id: "33", name: "Other" },
];

// Route definitions
export const ROUTES = {
  DASHBOARD: {
    HOME: "home",
    EVENTS: "events",
    FINANCE: "finance",
    USERS: "users",
    DOCUMENTS: "documents",
  },
  AUTH: {
    PERSONAL_INFO: "personal-info",
    EDUCATION_DATA: "education-data",
    NEXT_OF_KIN: "next-of-kin",
    UCCA_INFO: "ucca-info",
    PREV_POSITION: "prev-position",
  },
};

export const DASHBOARD_BASE_PATH = "/dashboard";

// Path validation utility
const validatePath = (path: string): string => {
  if (!path || path.includes(" ") || /[^a-zA-Z0-9-_]/.test(path)) {
    throw new Error(
      `Invalid path: ${path}. Paths must be non-empty and contain only alphanumeric characters, hyphens, or underscores.`
    );
  }
  return path.toLowerCase();
};

/**
 * Navigation items for the authentication/registration flow.
 * Each item represents a step in the process, with a required step number.
 */
export const authMenu: AuthSidebarProps[] = [
  {
    label: "Personal Information",
    path: validatePath(ROUTES.AUTH.PERSONAL_INFO),
    step: 1,
  },
  {
    label: "Education Data",
    path: validatePath(ROUTES.AUTH.EDUCATION_DATA),
    step: 2,
  },
  {
    label: "Next of Kin",
    path: validatePath(ROUTES.AUTH.NEXT_OF_KIN),
    step: 3,
  },
  {
    label: "UCCA Information",
    path: validatePath(ROUTES.AUTH.UCCA_INFO),
    step: 4,
  },
  {
    label: "Previous Position",
    path: validatePath(ROUTES.AUTH.PREV_POSITION),
    step: 5,
  },
];

/**
 * Navigation items for the main dashboard sidebar.
 * Each item includes an icon for visual representation.
 */
export const dashboardMenu: DashboardSidebarProps[] = [
  { label: "Home", path: validatePath(ROUTES.DASHBOARD.HOME), Icon: TbHome2 },
  {
    label: "Events",
    path: validatePath(ROUTES.DASHBOARD.EVENTS),
    Icon: TbCalendarEventFilled,
  },
  {
    label: "Finance",
    path: validatePath(ROUTES.DASHBOARD.FINANCE),
    Icon: FaCoins,
  },
  { label: "Users", path: validatePath(ROUTES.DASHBOARD.USERS), Icon: FaUser },
  {
    label: "Documents",
    path: validatePath(ROUTES.DASHBOARD.DOCUMENTS),
    Icon: FaFileAlt,
  },
];
