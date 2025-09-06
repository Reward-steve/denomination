import { useForm } from "react-hook-form";
import { useRegistration } from "../../../hooks/useReg";
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { FaLock, FaPhone, FaTimes } from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useEffect } from "react";
import { login } from "../services/auth";
import { toast } from "react-toastify";

// The Login component
interface ModalProps {
  showLogin: boolean;
  handleCloseLogin: () => void;
}
import ReactDOM from "react-dom";

export function Login({ showLogin, handleCloseLogin }: ModalProps) {
  const { setStep } = useRegistration();
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

  useEffect(() => {
    setStep(0);
  }, [setStep]);

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
    } else {
      toast.success(res.message);
      return res.data;
    }
  };

  if (!showLogin) return null;

  // Render modal via portal
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-2xl relative transition-transform transform scale-100 animate-fade">
        <button
          onClick={handleCloseLogin}
          aria-label="Close login form"
          className="absolute top-4 right-4 text-primary hover:text-secondary transition-colors"
        >
          <FaTimes className="h-5 w-5" />
        </button>

        <Form
          title="Login"
          description="Enter your phone number and password to continue."
          onSubmit={handleSubmit(onSubmit)}
        >
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
        </Form>
      </div>
    </div>,
    document.body // portal renders modal at the root of the DOM
  );
}
