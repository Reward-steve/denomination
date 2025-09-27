import { EducationData } from "../modules/auth/pages/EducationalData";
import NOKInfo from "../modules/auth/pages/NextOfKin";
import PersonalInfo from "../modules/auth/pages/PersonalInfo";
import PrevPosition from "../modules/auth/pages/PreviousPosition";
import RegistrationSuccess from "../modules/auth/pages/RegistrationSuccess";
import UCCAInfo from "../modules/auth/pages/UCCAInfo";

import Announcements from "../modules/dashboard/pages/Announcements";
import Document from "../modules/dashboard/pages/Documents";
import Events from "../modules/dashboard/pages/Events";
import { EventView } from "../modules/dashboard/pages/Events/EventView";
import Finance from "../modules/dashboard/pages/Finance";
import TransactionHistory from "../modules/dashboard/pages/Finance/txnHistory";
import Home from "../modules/dashboard/pages/Home";
import Sermon from "../modules/dashboard/pages/Sermon";
import Songs from "../modules/dashboard/pages/Songs";
import Users from "../modules/dashboard/pages/Users";
import UserProfile from "../modules/dashboard/pages/Users/UserProfile";

export const auth = [
  { path: "personal-info", element: PersonalInfo },
  { path: "ucca-info", element: UCCAInfo },
  { path: "education-data", element: EducationData },
  { path: "next-of-kin", element: NOKInfo },
  { path: "prev-position", element: PrevPosition },
  { path: "success", element: RegistrationSuccess },
];

export const dashboard = [
  { path: "home", element: Home },
  { path: "events", element: Events },
  { path: "events/:eventId/view", element: EventView },
  { path: "finance", element: Finance },
  { path: "transaction-history", element: TransactionHistory },
  { path: "users", element: Users },
  { path: "users/:userId/profile", element: UserProfile },

  { path: "documents", element: Document },
  { path: "Songs", element: Songs },
  { path: "sermon", element: Sermon },
  { path: "announcements", element: Announcements },
];
