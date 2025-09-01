import { useForm } from "react-hook-form";
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { MdEmail } from "react-icons/md";
import { Button } from "../../../components/ui/Button";
import { useRegistration } from "../../../hooks/useRegistrationContext";
import { useEffect } from "react";
import { resetPassword } from "../services/auth";
import { Loader } from "../../../components/ui/loader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { encryptEmail } from "../../../utils/encryptEmail";
import { Link } from "react-router-dom";

export default function ForgottenPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string }>();
  const navigate = useNavigate();

  const onSubmit = async ({ email }: { email: string }) => {
    try {
      const data = await resetPassword(email);
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      const encrypted = encryptEmail(email);
      localStorage.setItem("idx", encrypted);
      toast.success(data.message);
      navigate("/auth/code-verification");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  const { setStep } = useRegistration();

  useEffect(() => {
    setStep(0);
  }, [setStep]);

  return (
    <>
      <Form to="login" onSubmit={handleSubmit(onSubmit)}>
        <header className="py-5 flex flex-col gap-2 w-full justify-center sm:items-center ">
          <h2 className="sm:text-4xl text-2xl font-semibold mb-1 ">
            Forgot your password?
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your email below to recover your password
          </p>
        </header>
        <div>
          <FormInput
            id="email"
            label="Email"
            placeholder="yourschool@email.com"
            icon={MdEmail}
            type="email"
            register={register("email", {
              required: "Email is required",
            })}
            error={errors.email}
          />
        </div>
        <Button
          disabled={isSubmitting}
          textSize="sm"
          type="submit"
          variant="auth"
        >
          {isSubmitting ? <Loader /> : "Submit"}
        </Button>

        <p className="text-center">
          Don't have an account?{" "}
          <Link to={"/auth/email"} className="text-light-primary">
            Signup Here
          </Link>
        </p>
      </Form>
    </>
  );
}
