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
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {showLogin && (
        <Modal showLogin={showLogin} handleCloseLogin={handleCloseLogin} />
      )}
      <div className="p-10 max-w-md text-center">
        <FaCheckCircle className="mx-auto text-green-500 text-6xl border-4 border-green-200 rounded-full" />
        <h1 className="mt-6 text-3xl font-bold text-gray-800">
          Registration Successful!
        </h1>
        <p className="mt-4 text-textPlaceholder">
          Congratulations! Your registration has been completed successfully.
          You can now proceed to your dashboard or continue exploring our
          services.
        </p>

        <div className="mt-8 flex flex-col space-y-4">
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
          <Button variant="outline" onClick={() => setShowLogin(true)}>
            Log in
          </Button>
        </div>
      </div>

      <p className="mt-6 text-textPlaceholder text-center text-sm">
        Thank you for registering with UCCA. We’re excited to have you on board!
      </p>
    </div>
  );
}
