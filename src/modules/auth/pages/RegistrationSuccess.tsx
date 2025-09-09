import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/Button";
import { FaCheckCircle } from "react-icons/fa";
import { useRegistration } from "../../../hooks/useReg";
import { Modal } from "../../Landing/components/Modal";

export default function RegistrationSuccess() {
  const navigate = useNavigate();
  const { setStep, setPrev } = useRegistration();
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);

  useEffect(() => {
    setStep(6);
    setPrev(true);

    window.scrollTo(0, 0);
  }, [setStep, setPrev]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {showLogin && (
        <Modal showLogin={showLogin} handleCloseLogin={handleCloseLogin} />
      )}
      <div className="max-w-sm text-center">
        <FaCheckCircle className="mx-auto text-green-500 text-6xl border-4 border-green-200 rounded-full" />
        <h1 className="mt-6 text-3xl font-bold text-text">
          Registration Successful!
        </h1>
        <p className="mt-4 text-text-placeholder">
          Congratulations! Your registration has been completed successfully.
          You can now proceed to your dashboard or continue exploring our
          services.
        </p>
        <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center gap-3 sm:gap-6 mt-6">
          <Button
            onClick={() => navigate("/dashboard")}
            textSize="sm"
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
          >
            Go to Dashboard
          </Button>

          <Button
            type="button"
            onClick={() => setShowLogin(true)}
            variant="secondary"
            textSize="sm"
            className="w-full sm:w-auto flex items-center justify-center"
          >
            Log in
          </Button>
        </div>
      </div>

      <p className="mt-6 text-text-secondary text-center text-sm">
        Thank you for registering with UCCA. We’re excited to have you on board!
      </p>
    </div>
  );
}
