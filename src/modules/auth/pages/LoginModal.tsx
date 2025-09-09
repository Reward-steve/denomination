import { useForm } from "react-hook-form";
import FormInput from "../../../components/ui/FormInput";
import { FaLock, FaPhone, FaTimes } from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useEffect, useRef } from "react";
import { login } from "../services/auth";
import { toast } from "react-toastify";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  showLogin: boolean;
  handleCloseLogin: () => void;
}

export function Login({ showLogin, handleCloseLogin }: ModalProps) {
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (formData: {
    phoneNumber: string;
    password: string;
  }) => {
    const payload = {
      phone: formData.phoneNumber,
      password: formData.password,
    };
    const res = await login(payload);
    if (!res.success) {
      toast.error(res.message);
      return;
    }
    toast.success(res.message);
    navigate("/dashboard");
    return res.data;
  };

  // ✅ Handle ESC key close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseLogin();
    };
    if (showLogin) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showLogin, handleCloseLogin]);

  // ✅ Prevent rendering when closed
  if (!showLogin) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === modalRef.current) handleCloseLogin(); // ✅ Close on outside click
      }}
      ref={modalRef}
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-2xl relative transition-transform transform scale-100 animate-fade">
        {/* Close Button */}
        <button
          onClick={handleCloseLogin}
          aria-label="Close login form"
          className="absolute top-4 right-4 text-accent hover:text-secondary transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        {/* Login Form */}
        {/* Login Form */}
        <div className="flex flex-col px-4 py-6 text-text animate-fade">
          <div className="flex-grow flex items-center justify-center mb-4 sm:mt-28 mt-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md rounded-lg space-y-5"
            >
              <header className="text-center">
                <h2 className="text-xl font-semibold text-text mb-1">Login</h2>
                <p className="text-sm text-textPlaceholder">
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

              <Button disabled={isSubmitting} type="submit" variant="auth">
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <Loader /> <span>Logging in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Login</span>
                    <FaArrowRightToBracket />
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>
        {/* ✅ Footer with signup link */}
        <div className="mt-4 text-center text-sm text-textPlaceholder">
          Don’t have an account?{" "}
          <button
            onClick={() => {
              handleCloseLogin();
              navigate("/auth");
            }}
            className="text-accent hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
