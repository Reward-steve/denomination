import { FaBan } from "react-icons/fa";
import { BackButton } from "../../../components/ui/BackButton";

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <FaBan className="text-6xl text-yellow-500 mb-4 animate-shake" />
      <h1 className="text-6xl font-extrabold text-text mb-2">403</h1>
      <p className="md:text-2xl sm:text-xl text-center text-subText mb-6">
        Access Forbidden – You don’t have permission to view this page.
      </p>
      <BackButton
        label="Back"
        className="bg-primary hover:bg-secondary text-text px-6 py-2 rounded-lg text-lg font-semibold transition"
      />
    </div>
  );
};

export default Forbidden;
