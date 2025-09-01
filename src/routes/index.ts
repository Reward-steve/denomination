import EnterEmail from "../modules/auth/pages/EnterEmail";
import VerifyEmail from "../modules/auth/pages/VerifyEmail";
import CreatePassword from "../modules/auth/pages/CreatePassword";
import CompleteSchoolProfile from "../modules/auth/pages/CompleteSchoolProfile";
import Success from "../modules/auth/pages/RegistrationSuccess";
import SignIn from "../modules/auth/pages/SignIn";
import ForgottenPassword from "../modules/auth/pages/ForgottenPassword";
import CodeVerification from "../modules/auth/pages/codeVerification";
import ResetPassword from "../modules/auth/pages/resetPassword";
import SetupclassAndArms from "../modules/auth/pages/SetupclassAndArms";
import SchoolOwnerInfo from "../modules/auth/pages/SchoolOwnerInfo";
import LandingPage from "../modules/Landing/pages/LandingPage";

export const authRoutes = [
  { path: "email", element: EnterEmail },
  { path: "verify-email", element: VerifyEmail },
  { path: "create-password", element: CreatePassword },
  { path: "complete-profile", element: CompleteSchoolProfile },
  { path: "create-school-owner", element: SchoolOwnerInfo },
  { path: "success", element: Success },
  { path: "setup-class", element: SetupclassAndArms },
  { path: "signin", element: SignIn },
  { path: "forgotten-password", element: ForgottenPassword },
  { path: "code-verification", element: CodeVerification },
  { path: "reset-password", element: ResetPassword },
];

export const webPages = [{ path: "landing-page", element: LandingPage }];
