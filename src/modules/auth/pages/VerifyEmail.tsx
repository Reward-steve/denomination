import { useEffect } from "react";
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
import { verifyCode } from "../services/auth";
import { useRegistration } from "../../../hooks/useRegistrationContext";
import { getFromStore } from "../../../utils/appHelpers";

export default function VerifyEmail() {
  const { setStep, updateData, data } = useRegistration();
  const { email } = data;

  useEffect(() => {
    setStep(2);
    // Restore email from localStorage if missing
    if (!email) {
      const storedEmail = getFromStore("idx");
      if (typeof storedEmail === "string" && storedEmail) {
        updateData({ email: storedEmail });
      }
    }
  }, [email, setStep, updateData]);

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
      updateData({ code: code });
      navigate("/auth/create-school-owner");
      toast.success(data.message);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <header className="text-center sm:py-5 py-6">
        <h2 className="text-xl font-bold mb-1">Check your email</h2>
        <p className="text-subText text-sm">
          We've sent a 6-digit code to{" "}
          <span className="text-text font-semibold">
            {email || "you@example.com"}
          </span>
          . Please enter it below to verify your email.
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
