import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { Button } from "../../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { type Event } from "../../types";
import { BasicInfoSection } from "./BasicInfoSection";
import { DateTimeSection } from "./DateTimeSection";
import { RecurringSection } from "./RecurringSection";
import { Loader } from "../../../../components/ui/Loader";

interface EventModalWrapperProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  handleModalClick: (e: React.MouseEvent) => void;
  event: Event;
  submitEvent: (data: Event) => Promise<void>;
  closeModal: () => void;
}

export const EventModalWrapper = ({
  modalRef,
  handleModalClick,
  event,
  submitEvent,
  closeModal,
}: EventModalWrapperProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<Event>({ defaultValues: event });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: Event) => {
    setErrorMessage(null);
    try {
      await submitEvent(data);
    } catch (err) {
      console.error("Failed to submit event:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const isLoading = isSubmitting;

  return (
    <div
      ref={modalRef}
      onClick={handleModalClick}
      className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
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
            id="event-modal-title"
            className="text-lg sm:text-xl md:text-2xl font-semibold text-text"
          >
            {event.id ? "Edit Event" : "Add New Event"}
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
          <BasicInfoSection register={register} errors={errors} />
          <DateTimeSection register={register} errors={errors} />
          <RecurringSection control={control} watch={watch} />

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
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="w-full sm:w-1/2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader size={16} />
                  <span className="text-sm sm:text-base">
                    {event.id ? "Updating..." : "Saving..."}
                  </span>
                </div>
              ) : (
                <span className="text-sm sm:text-base">
                  {event.id ? "Update" : "Save"}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
