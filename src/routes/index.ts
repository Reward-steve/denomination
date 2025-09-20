import { EducationData } from "../modules/auth/pages/EducationalData";
import NOKInfo from "../modules/auth/pages/NextOfKin";
import PersonalInfo from "../modules/auth/pages/PersonalInfo";
import PrevPosition from "../modules/auth/pages/PreviousPosition";
import RegistrationSuccess from "../modules/auth/pages/RegistrationSuccess";
import UCCAInfo from "../modules/auth/pages/UCCAInfo";
import Announcement from "../modules/dashboard/announcement/Announcement";
import Documents from "../modules/dashboard/documents/page/Documents";
import Events from "../modules/dashboard/events/page/Events";
import Finance from "../modules/dashboard/finance/page/Finance";
import Home from "../modules/dashboard/home/page/Home";
import Sermon from "../modules/dashboard/sermon/Sermon";
import Songs from "../modules/dashboard/songs/page/Songs";
import Users from "../modules/dashboard/users/page/Users";

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
  { path: "finance", element: Finance },
  { path: "users", element: Users },
  { path: "documents", element: Documents },
  { path: "Songs", element: Songs },
  { path: "sermon", element: Sermon },
  { path: "announcement", element: Announcement },
];
