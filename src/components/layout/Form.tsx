import Logo from "../../components/ui/Logo";
import type { SubmitHandler } from "react-hook-form";
import type { FormEvent } from "react";
import { useRegistration } from "../../hooks/useRegistrationContext";
import { BackButton } from "../ui/BackButton";

interface FormProps {
  to?: string;
  onSubmit: SubmitHandler<FormEvent>;
  children: React.ReactNode;
  pageTitle?: string;
  title?: string;
  description?: string;
}

export default function Form({
  onSubmit,
  children,
  pageTitle,
  title,
  description,
}: FormProps) {
  const { step, prev } = useRegistration();

  return (
    <div className="flex flex-col px-4 py-6 bg-background text-text">
      <div className="sm:block hidden">
        <Logo />
      </div>
      {prev && <BackButton />}

      <div className="flex-grow flex items-center justify-center mb-4 sm:mt-28 mt-10">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-lg space-y-5"
        >
          {/* Step Progress */}
          {step > 0 && step < 4 ? (
            <div>
              <p className="text-sm font-medium text-secondary mb-2 flex justify-between">
                <span className="text-xs font-semibold text-subText">
                  Step {step} of 4
                </span>
                <span className="text-xs text-subText">Registration</span>
              </p>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              {pageTitle && (
                <header className="text-center">
                  <h2 className="text-2xl font-bold text-headingColor">
                    {pageTitle}
                  </h2>
                </header>
              )}
            </>
          )}

          {/* Header */}
          {(title || description) && (
            <header className="text-center py-4">
              <h2 className="text-xl font-semibold text-headingColor mb-1">
                {title}
              </h2>
              <p className="text-sm text-subText">{description}</p>
            </header>
          )}

          {/* Form Fields */}
          {children}
        </form>
      </div>
    </div>
  );
}
