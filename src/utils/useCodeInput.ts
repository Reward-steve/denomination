import { useState, useRef } from "react";

export function useCodeInput(length = 6) {
  const [codeDigits, setCodeDigits] = useState(Array(length).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...codeDigits];
    updated[index] = value;
    setCodeDigits(updated);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getCode = () => codeDigits.join("");

  return {
    codeDigits,
    inputRefs,
    handleChange,
    handleKeyDown,
    getCode,
  };
}
