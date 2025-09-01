import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import Form from "../../../components/layout/Form";
import { useRegistration } from "../../../hooks/useRegistrationContext";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FormInput from "../../../components/ui/FormInput";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import { requestCode } from "../services/auth";
import { Loader } from "../../../components/ui/loader";
import { Link } from "react-router-dom";
import { saveInStore } from "../../../utils/appHelpers";

export type FormValues = {
  email: string;
};

export default function EnterEmail() {
  const { setStep, updateData } = useRegistration();

  useEffect(() => {
    setStep(1);
  }, [setStep]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const navigate = useNavigate();

  const onSubmit = async ({ email }: FormValues) => {
    try {
      const data = await requestCode(email);
      console.log(data);
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      saveInStore("idx", email);
      updateData({ email });
      toast.success(data.message);
      navigate("/auth/verify-email");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Form
      title="Get Started"
      description="Enter your official school email to begin registration."
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        type="email"
        label="Email"
        placeholder="yourschool@gmail.com"
        icon={MdEmail}
        register={register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email",
          },
        })}
        error={errors.email}
      />

      <Button
        disabled={isSubmitting}
        textSize="sm"
        type="submit"
        variant="auth"
      >
        {isSubmitting ? (
          <Loader />
        ) : (
          <>
            Send Verification Code <FaArrowRightLong className="ml-2" />
          </>
        )}
      </Button>

      <div className="text-center text-subText">
        Already have an account?{" "}
        <Link to={"/auth/signin"} className="text-primary ml-1 font-semibold">
          Login
        </Link>
      </div>
    </Form>
  );
}
