import { useState } from "react";
import { Button } from "../../../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { type Event } from "../../../types";
import { BasicInfoSection } from "./BasicInfoSection";
import { DateTimeSection } from "./DateTimeSection";
import { RecurringSection } from "./RecurringSection";
import { Loader } from "../../../../../components/ui/Loader";
import Modal from "../../../components/Modal";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  submitEvent: (data: Event) => Promise<void>;
}

export const EventModal = ({
  isOpen,
  onClose,
  event,
  submitEvent,
}: EventModalProps) => {
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
      onClose();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event.id ? "Edit Event" : "Add New Event"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoSection register={register} errors={errors} />
        <DateTimeSection register={register} errors={errors} />
        <RecurringSection control={control} watch={watch} />

        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}

        <div className="flex items-center justify-center flex-col sm:flex-row w-full gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader size={16} />
                {event.id ? "Updating..." : "Saving..."}
              </div>
            ) : event.id ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
