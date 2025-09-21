import type { IconType } from "react-icons";
import { FaCoins, FaMusic, FaUser } from "react-icons/fa6";
import { FaFileAlt, FaPray } from "react-icons/fa";
import { TbCalendarEventFilled, TbHome2 } from "react-icons/tb";
import { MdAnnouncement } from "react-icons/md";

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

// Route definitions
export const ROUTES = {
  DASHBOARD: {
    HOME: "home",
    EVENTS: "events",
    FINANCE: "finance",
    USERS: "users",
    DOCUMENTS: "documents",
    SONGS: "songs",
    SERMON: "sermon",
    ANNOUNCEMENT: "announcements",
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
  {
    label: "Songs",
    path: validatePath(ROUTES.DASHBOARD.SONGS),
    Icon: FaMusic,
  },
  {
    label: "Sermon",
    path: validatePath(ROUTES.DASHBOARD.SERMON),
    Icon: FaPray,
  },
  {
    label: "Announcement",
    path: validatePath(ROUTES.DASHBOARD.ANNOUNCEMENT),
    Icon: MdAnnouncement,
  },
];
