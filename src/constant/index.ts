import { FaCoins, FaFileAlt } from "react-icons/fa";
import type { SidebarPros } from "../components/ui/Sidebar";
import { TbCalendarEventFilled, TbHome2 } from "react-icons/tb";
import { FaUser } from "react-icons/fa6";

export const authMenu: SidebarPros[] = [
  {
    label: "Personal Information",
    path: "personal-info",
    step: 1,
  },
  { label: "Education Data", path: "education-data", step: 2 },
  { label: "Next of Kin", path: "next-of-kin", step: 3 },
  { label: "UCCA Information", path: "ucca-info", step: 4 },
  { label: "Previous Position", path: "prev-position", step: 5 },
];

export const dashboardMenu: SidebarPros[] = [
  { label: "Home", path: "home", Icon: TbHome2 },
  { label: "Events", path: "Events", Icon: TbCalendarEventFilled },
  { label: "Finance", path: "Finance", Icon: FaCoins },
  { label: "Users", path: "Users", Icon: FaUser },
  { label: "Documents", path: "Documents", Icon: FaFileAlt },
];
