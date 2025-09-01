import { Button } from "../../../components/ui/Button";
import img from "../../../assets/img/setup.png";
import { useNavigate } from "react-router";

export default function SetupclassAndArms() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm sm:max-w-md p-8 text-center">
        {/* Image Section */}
        <div className="flex justify-center mb-6">
          {/* Placeholder image. Replace this with your actual asset. */}
          <img src={img} alt="Setup Complete" />
        </div>

        {/* Content Section */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mt-4">
          You're all set!
        </h2>
        <p className="text-sm sm:text-base text-subText mt-2 leading-relaxed max-w-xs mx-auto">
          You are just a few clicks away from enjoying a seamless school
          management system.
        </p>

        {/* Button Section */}
        <div className="mt-8">
          <Button
            variant="auth"
            textSize="sm"
            onClick={() => navigate("/school-setup/class")}
          >
            Setup Class & Arm
          </Button>
        </div>
      </div>
    </div>
  );
}
