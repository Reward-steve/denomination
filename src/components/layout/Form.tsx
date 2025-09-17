import type { ReactNode, FormEventHandler } from "react";
import { useRegistration } from "../../hooks/useReg";

interface FormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
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
  const { step } = useRegistration();

  return (
    <div className="flex flex-col py-6 px-4 text-text animate-fade">
      <div className="flex-grow flex items-center justify-center mb-4 sm:mt-28 mt-10">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-lg space-y-5"
        >
          {/* Step Progress */}
          {step > 0 && step < 5 ? (
            <div>
              <p className="text-sm font-medium text-accent mb-2 flex justify-between">
                <span className="text-xs font-semibold text-text-placeholder">
                  Step {step} of 5
                </span>
                <span className="text-xs text-text-placeholder">
                  Registration
                </span>
              </p>
              <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${(step / 5) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            pageTitle && (
              <header className="text-center">
                <h2 className="text-2xl font-bold text-text">{pageTitle}</h2>
              </header>
            )
          )}

          {/* Header */}
          {(title || description) && (
            <header className="text-center py-4">
              {title && (
                <h2 className="text-xl font-semibold text-text mb-1">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-text-placeholder">{description}</p>
              )}
            </header>
          )}

          {/* Form Fields */}
          {children}
        </form>
      </div>
    </div>
  );
}
