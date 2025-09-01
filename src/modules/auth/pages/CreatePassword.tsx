import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../../hooks/useRegistrationContext";
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { Button } from "../../../components/ui/Button";
import { FaArrowRightLong } from "react-icons/fa6";
import { getStrength } from "../../../utils/usePwStrengthIndicator";
import { createPassword } from "../services/auth";
import { toast } from "react-toastify";
import { Loader } from "../../../components/ui/loader";
import { decryptEmail } from "../../../utils/encryptEmail";

export default function CreatePassword() {
  const { setStep, updateData, data } = useRegistration();
  const { email } = data;

  useEffect(() => {
    setStep(3);
    // Restore email from localStorage if missing
    if (!email) {
      const encrypted = localStorage.getItem("idx");
      if (encrypted) {
        const decrypted = decryptEmail(encrypted);
        updateData({ email: decrypted });
      }
    }
  }, [email, setStep, updateData]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<{ password: string; cpassword: string }>();

  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data: { password: string; cpassword: string }) => {
    const { password, cpassword } = data;
    try {
      const res = await createPassword(email, password, cpassword);
      console.log(res);

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      updateData(data);
      toast.success(res.message);
      navigate("/auth/complete-profile");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Form
      title="Create Your Password"
      description=" This password will be used to sign in to the admins dashboard."
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <FormInput
          id="password"
          type="password"
          label="Password"
          placeholder="********"
          error={errors.password}
          register={register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
        {password && (
          <div className="text-sm mt-1">
            Strength:{" "}
            <span
              className={
                getStrength(password) === "Strong"
                  ? "text-green-600"
                  : getStrength(password) === "Medium"
                  ? "text-yellow-600"
                  : "text-error"
              }
            >
              {getStrength(password)}
            </span>
          </div>
        )}
      </div>
      <div>
        <FormInput
          id="confirm"
          type="password"
          label="Confirm Password"
          placeholder="********"
          error={errors.cpassword}
          register={register("cpassword", {
            required: "Please confirm your password",
            validate: (val) => val === password || "Passwords do not match",
          })}
        />
      </div>

      <Button
        disabled={isSubmitting}
        textSize="sm"
        variant="auth"
        type="submit"
      >
        {isSubmitting ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            Continue <FaArrowRightLong className="ml-2" />
          </>
        )}
      </Button>
    </Form>
  );
}
