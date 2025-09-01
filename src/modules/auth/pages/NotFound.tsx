import { FaExclamationTriangle } from "react-icons/fa";
import { BackButton } from "../../../components/ui/BackButton";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <FaExclamationTriangle className="text-6xl text-red-500 mb-4 animate-pulse" />
      <h1 className="text-6xl font-extrabold text-text mb-2">404</h1>
      <p className="text-2xl text-subText mb-6">Page Not Found</p>
      <BackButton
        label="Back"
        className="bg-primary hover:bg-secondary text-text px-6 py-2 rounded-lg text-lg font-semibold transition"
      />
    </div>
  );
}
