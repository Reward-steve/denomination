import { useEffect, useState } from "react";
import { resetPassword } from "../modules/auth/services/auth";
import { useRegistration } from "../hooks/useRegistrationContext";
import { decryptEmail } from "./encryptEmail";
import { toast } from "react-toastify";

export function useResendCode() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [timmer, setTimmer] = useState(0);
  const { data, updateData } = useRegistration();
  const { email } = data;

  useEffect(() => {
    if (!email) {
      const encrypted = localStorage.getItem("idx");
      if (encrypted) {
        const decrypted = decryptEmail(encrypted);
        updateData({ email: decrypted });
      }
    }
    let interval: number;
    if (timmer > 0) {
      interval = setInterval(() => {
        setTimmer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timmer, email, updateData]);

  const handleResend = async () => {
    if (timmer > 0) return; // Prevent double-click during countdown

    try {
      setStatus("sending");
      const data = await resetPassword(email); // Trigger actual resend logic
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      toast.success("verification code resent");
      setStatus("sent");
      setTimmer(60); // Start countdown after resend
    } catch (error) {
      setStatus("idle");
      throw error;
    }
  };

  return { status, timmer, handleResend };
}
