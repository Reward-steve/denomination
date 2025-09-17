import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { loginApi } from "../services/auth";
import FormInput from "../../../components/ui/FormInput";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { FaLock, FaPhone, FaArrowRightToBracket } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import ReactDOM from "react-dom";
import clsx from "clsx";
import { toast } from "react-toastify";
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
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { phoneNumber: "", password: "" },
  });

  const from =
    location.state?.from?.pathname ||
    localStorage.getItem("prevRoute") ||
    "/dashboard";

  const onSubmit = async (formData: FormData) => {
    try {
      const res = await loginApi({
        phone: formData.phoneNumber,
        password: formData.password,
      });

      if (!res.success || !res.data?.token) {
        toast.error(res.message || "Login failed. Please try again.");
        return;
      }

      login(res.data.token, res.data.user as User);

      toast.success(res.message || "Logged in successfully!");
      handleCloseLogin();

      // ✅ Redirect to stored route or fallback
      localStorage.removeItem("prevRoute");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unexpected error.");
    }
  };

  // Handle ESC + focus trap
  useEffect(() => {
    if (!showLogin) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseLogin();
    };

    const handleTab = (e: KeyboardEvent) => {
      const focusable = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable) return;

      const first = focusable[0] as HTMLElement;
      const last = focusable[focusable.length - 1] as HTMLElement;

      if (e.key === "Tab") {
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
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = "";
    };
  }, [showLogin, handleCloseLogin]);

  if (!showLogin) return null;

  return ReactDOM.createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-0"
      onClick={(e) => {
        if (e.target === modalRef.current) handleCloseLogin();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={clsx(
          "relative w-full max-w-md bg-surface rounded-2xl shadow-2xl",
          "p-6 sm:p-8 animate-fade transition-all duration-500"
        )}
      >
        {/* Close button */}
        <button
          onClick={handleCloseLogin}
          aria-label="Close login form"
          className="absolute top-4 right-4 text-accent hover:text-secondary transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {isAuthenticated ? (
          // 🔹 Already logged in view
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold text-text">
              You’re already logged in
            </h2>
            <p className="text-sm text-text-placeholder">
              Signed in as{" "}
              <span className="font-medium">{user?.primary_phone}</span>
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="auth"
                onClick={() => {
                  handleCloseLogin();
                  navigate("/dashboard");
                }}
              >
                Go to Dashboard
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  handleCloseLogin();
                  navigate("/dashboard/events");
                }}
              >
                View Events
              </Button>
            </div>
          </div>
        ) : (
          // 🔹 Normal login form
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
            noValidate
          >
            {/* Header */}
            <header className="text-center">
              <h2 className="text-2xl font-bold text-text">Welcome Back</h2>
              <p className="text-sm text-text-placeholder mt-1">
                Log in with your phone number and password to continue.
              </p>
            </header>

            {/* Inputs */}
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

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
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

            {/* Footer: Signup link */}
            <footer className="text-center text-sm text-text-placeholder">
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-accent font-medium hover:underline"
                onClick={() => {
                  handleCloseLogin();
                  navigate("/auth");
                }}
              >
                Sign up
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
