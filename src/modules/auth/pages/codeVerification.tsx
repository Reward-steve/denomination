import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import Form from "../../../components/layout/Form";
import { Button } from "../../../components/ui/Button";
import CodeInput from "../components/CodeInput";
import { Loader } from "../../../components/ui/loader";
import { useCodeInput } from "../../../utils/useCodeInput";
import { useResendCode } from "../../../utils/useResendCode";
import { decryptEmail } from "../../../utils/encryptEmail";
import { verifyCode } from "../services/auth";
import { useRegistration } from "../../../hooks/useRegistrationContext";

export default function CodeVerification() {
  const { setStep } = useRegistration();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    setStep(0);
    // Restore email from localStorage if missing
    if (!email) {
      const encrypted = localStorage.getItem("idx");
      if (encrypted) {
        const decrypted = decryptEmail(encrypted);
        setEmail(decrypted);
      }
    }
  }, [email, setStep]);

  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const { codeDigits, inputRefs, handleChange, handleKeyDown, getCode } =
    useCodeInput(6);
  const { status, timmer, handleResend } = useResendCode();
  const navigate = useNavigate();

  const onSubmit = async () => {
    const code = getCode();
    if (!/^\d{6}$/.test(code)) {
      setError("code", { message: "Code must be 6 digits" });
      return;
    }

    try {
      const data = await verifyCode(email, code);
      if (!data.success) {
        toast.error(data.message);
        return;
      }

      navigate("/auth/reset-password");
      toast.success(data.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} pageTitle="">
      <header className="py-5 flex flex-col gap-2 w-full justify-center sm:text-center sm:items-center ">
        <h2 className="text-xl font-bold mb-1">Check your email</h2>
        <p className="text-subText text-sm">
          An authentication code has been sent to your Email
        </p>
      </header>

      <CodeInput
        digits={codeDigits}
        refs={inputRefs}
        onChange={(val, idx) => {
          handleChange(val, idx);
          clearErrors("code");
        }}
        onKeyDown={handleKeyDown}
      />

      {errors.code && (
        <p className="text-sm text-error mt-1 text-center animate-shake">
          {errors.code.message as string}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="auth"
        textSize="sm"
      >
        {isSubmitting ? (
          <Loader />
        ) : (
          <>
            Verify email <FaArrowRightLong className="ml-2" />
          </>
        )}
      </Button>

      <div className="text-sm text-subText text-center">
        Didn’t get the code?{" "}
        <button
          type="button"
          onClick={async () => handleResend()}
          disabled={status === "sending" || timmer > 0}
          className={`text-primary hover:underline font-semibold ${
            timmer > 0 ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {status === "sending" ? "Sending..." : ""}
          {status === "idle" ? "Resend code" : ""}
          {status === "sent"
            ? ` ${
                timmer > 0
                  ? `-00:${timmer.toString().padStart(2, "0")}`
                  : "Resend code"
              }`
            : ""}
        </button>
      </div>
    </Form>
  );
}
