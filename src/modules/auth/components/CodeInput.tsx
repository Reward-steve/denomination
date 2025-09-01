import { type CodeInputProps } from "../../../types/auth.types";

export default function CodeInput({
  digits,
  refs,
  onChange,
  onKeyDown,
}: CodeInputProps) {
  return (
    <div className="flex gap-3 justify-center mb-2 px-4">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          autoComplete="one-time-code"
          aria-label={`Digit ${i + 1}`}
          value={digit}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d?$/.test(value)) {
              onChange(value, i);
            }
          }}
          onKeyDown={(e) => onKeyDown(e, i)}
          className="w-12 h-12 text-center border border-border text-text bg-background rounded-md text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
        />
      ))}
    </div>
  );
}
