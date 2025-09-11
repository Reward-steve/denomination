import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { FaCheckCircle } from "react-icons/fa";
import { useRegistration } from "../../../hooks/useReg";

export default function RegistrationSuccess() {
  const navigate = useNavigate();
  const { setStep, setPrev } = useRegistration();

  useEffect(() => {
    setStep(6);
    setPrev(true);
    window.scrollTo(0, 0);
  }, [setStep, setPrev]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm text-center">
        {/* Success icon */}
        <FaCheckCircle className="mx-auto text-green-500 text-6xl border-4 border-green-200 rounded-full shadow-md" />

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold text-text">
          Registration Successful!
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-text-placeholder leading-relaxed">
          Congratulations! Your registration has been completed successfully You
          can now access your dashboard and start exploring all the features.
        </p>

        {/* CTA Buttons */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-center items-center gap-3 sm:gap-6 mt-6">
          <Button
            onClick={() => navigate("/dashboard")}
            textSize="sm"
            type="button"
            variant="auth"
            className="w-full sm:w-auto"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>

      {/* Closing message */}
      <p className="mt-6 text-text-secondary text-center text-sm max-w-md">
        Thank you for registering with{" "}
        <span className="font-semibold">UCCA</span>. We’re excited to have you
        on board
      </p>
    </div>
  );
}
