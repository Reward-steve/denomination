import { useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { loginApi } from "../services/auth";
import FormInput from "../../../components/ui/FormInput";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { FaLock, FaPhone, FaArrowRightToBracket } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import ReactDOM from "react-dom";
import clsx from "clsx";
import { getFromStore, saveInStore } from "../../../utils/appHelpers";
import type { User } from "../../../types/auth.types";

interface ModalProps {
  showLogin: boolean;
  handleCloseLogin: () => void;
}

interface FormData {
  phoneNumber: string;
  password: string;
}

export function Login({ showLogin, handleCloseLogin }: ModalProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (formData: FormData) => {
    try {
      const payload = {
        phone: formData.phoneNumber,
        password: formData.password,
      };
      const res = await loginApi(payload);

      if (!res.success || !res.data?.token) {
        toast.error(res.message || "Login failed. Please try again.");
        return;
      }

      login(res.data.token);
      saveInStore("token", res.data.token);
      saveInStore("curr_user", res?.data?.user as User);
      toast.success(res.message || "Logged in successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  useEffect(() => {
    const allow = getFromStore("curr_user");

    if (allow) {
      // User already logged in → just close modal
      handleCloseLogin();
      navigate("/dashboard");
    }
  }, [handleCloseLogin]);

  // Handle ESC key and focus trapping
  useEffect(() => {
    if (!showLogin) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseLogin();
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements) return;

        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("keydown", handleTab);
    firstInputRef.current?.focus(); // Focus first input on open

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("keydown", handleTab);
    };
  }, [showLogin, handleCloseLogin]);

  // Handle signup navigation with delay for close animation
  const handleSignupClick = useCallback(() => {
    handleCloseLogin();
    setTimeout(() => navigate("/auth"), 300); // Match animate-fade duration
  }, [handleCloseLogin, navigate]);

  // Prevent rendering when closed
  if (!showLogin) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === modalRef.current) handleCloseLogin();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      aria-describedby="login-description"
    >
      <div
        className={clsx(
          "bg-surface rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl",
          "transition-all duration-500 transform scale-100 animate-fade"
        )}
      >
        {/* Close Button */}
        <button
          onClick={handleCloseLogin}
          aria-label="Close login form"
          className="absolute top-4 right-4 text-accent hover:text-secondary transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 py-6"
          noValidate
        >
          <header className="text-center">
            <h2 id="login-title" className="text-xl font-semibold text-text">
              Login
            </h2>
            <p
              id="login-description"
              className="text-sm text-text-placeholder mt-1"
            >
              Enter your phone number and password to continue.
            </p>
          </header>

          <FormInput
            label="Phone Number"
            placeholder="e.g., 08012345678"
            icon={FaPhone}
            register={register("phoneNumber", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Please enter a valid phone number",
              },
            })}
            error={errors.phoneNumber}
          />

          <FormInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            icon={FaLock}
            register={register("password", {
              required: "Password is required",
            })}
            error={errors.password}
          />

          <Button
            disabled={isSubmitting}
            type="submit"
            variant="auth"
            className="w-full flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <FaArrowRightToBracket className="text-sm" />
              </>
            )}
          </Button>

          <div className="text-center text-sm text-text-placeholder">
            Don’t have an account?{" "}
            <button
              type="button"
              onClick={handleSignupClick}
              className="text-accent hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
