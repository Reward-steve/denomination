import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { Button } from "./Button";
import { Loader } from "./Loader";
import { useForm, type FieldValues, type UseFormReturn } from "react-hook-form";

interface BaseModalProps<T extends FieldValues> {
  modalRef: React.RefObject<HTMLDivElement | null>;
  handleModalClick: (e: React.MouseEvent) => void;
  closeModal: () => void;

  // Customization
  title: string;
  submitLabel?: string;
  cancelLabel?: string;

  // Form props
  defaultValues: T;
  submitHandler: (data: T) => Promise<void>;

  // Dynamic form sections (form API is provided)
  children: (form: UseFormReturn<T>) => React.ReactNode;
}

export function BaseModal<T extends FieldValues>({
  modalRef,
  handleModalClick,
  closeModal,
  title,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  defaultValues,
  submitHandler,
  children,
}: BaseModalProps<T>) {
  const form = useForm<T>(defaultValues);
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: T) => {
    setErrorMessage(null);
    try {
      await submitHandler(data);
    } catch (err) {
      console.error("Failed to submit:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      ref={modalRef}
      onClick={handleModalClick}
      className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="
          bg-surface rounded-t-2xl w-full 
          max-w-lg sm:max-w-xl md:max-w-2xl 
          mx-auto shadow-2xl 
          px-3 sm:px-4 md:px-6 
          pb-4 
          relative max-h-[90vh] 
          overflow-y-auto 
          animate-slide-up
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="sticky top-0 flex items-center justify-between mb-4 border-b border-border py-4 bg-surface z-10">
          <h2
            id="modal-title"
            className="text-lg sm:text-xl md:text-2xl font-semibold text-text"
          >
            {title}
          </h2>
          <button
            onClick={closeModal}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-background/70 transition-colors"
          >
            <FaX size={18} className="text-primary" />
          </button>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 sm:space-y-6"
        >
          {/* Dynamic Sections */}
          {children(form)}

          {/* Error Message */}
          {errorMessage && (
            <p className="text-sm sm:text-base text-red-500 text-center">
              {errorMessage}
            </p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 py-4 w-full">
            <Button
              variant="outline"
              onClick={closeModal}
              type="button"
              className="w-full sm:w-1/2"
              size="lg"
              disabled={isSubmitting}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="w-full sm:w-1/2"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader size={16} />
                  <span className="text-sm sm:text-base">{submitLabel}...</span>
                </div>
              ) : (
                <span className="text-sm sm:text-base">{submitLabel}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
