import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/Button";
import { FaCheckCircle } from "react-icons/fa";
import { useRegistration } from "../../../hooks/useReg";
import { Modal } from "../../Landing/components/Modal";

/**
 * RegistrationSuccess
 * ------------------------------------------------
 * Final step in registration flow.
 * Shows a confirmation message and directs users
 * to their dashboard.
 */
export default function RegistrationSuccess() {
  const { setStep, setPrev } = useRegistration();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    setStep(6);
    setPrev(true);
    window.scrollTo(0, 0);
  }, [setStep, setPrev]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <section className="max-w-sm text-center">
        {/* Success Icon */}
        <FaCheckCircle className="mx-auto text-green-500 text-6xl border-4 border-green-200 rounded-full shadow-md" />

        {/* Title */}
        <h1 className="mt-6 text-3xl font-bold text-text">
          Registration Successful!
        </h1>

        {/* Message */}
        <p className="mt-4 text-base text-text-placeholder leading-relaxed">
          🎉 Congratulations! Your registration is complete. You can now access
          your dashboard and explore all features.
        </p>

        {/* CTA */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
          <Button
            onClick={() => setShowLogin(true)}
            textSize="sm"
            type="button"
            variant="auth"
            className="w-full sm:w-auto"
          >
            Login
          </Button>
        </div>
      </section>

      {/* Footer Note */}
      <p className="mt-6 text-text-secondary text-center text-sm max-w-md">
        Thank you for joining <span className="font-semibold">UCCA</span>. We’re
        excited to have you on board!
      </p>
      {/* Login Modal */}
      {showLogin && (
        <Modal
          showLogin={showLogin}
          handleCloseLogin={() => setShowLogin(false)}
        />
      )}
    </main>
  );
}
