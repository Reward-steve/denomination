import { EducationData } from "../modules/auth/pages/EducationalData";
import NOKInfo from "../modules/auth/pages/NextOfKin";
import PersonalInfo from "../modules/auth/pages/PersonalInfo";
import PrevPosition from "../modules/auth/pages/PreviousPosition";
import UCCAInfo from "../modules/auth/pages/UCCAInfo";
import LandingPage from "../modules/Landing/pages/LandingPage";

export const auth = [
  { path: "personal-info", element: PersonalInfo },
  { path: "ucca-info", element: UCCAInfo },
  { path: "education-data", element: EducationData },
  { path: "next-of-kin", element: NOKInfo },
  { path: "prev-position", element: PrevPosition },
];

export const webPages = [{ path: "landing-page", element: LandingPage }];
