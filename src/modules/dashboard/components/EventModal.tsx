import { FaX } from "react-icons/fa6";
import { Button } from "../../../components/ui/Button";
import { useForm } from "react-hook-form";
import { type Event } from "../types";
import { BasicInfoSection } from "./BasicInfoSection";
import { DateTimeSection } from "./DateTimeSection";
import { RecurringSection } from "./RecurringSection";

interface EventModalWrapperProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  handleModalClick: (e: React.MouseEvent) => void;
  event: Event;
  submitEvent: (data: Event) => void;
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
    formState: { errors },
    watch,
  } = useForm<Event>({ defaultValues: event });

  return (
    <div
      ref={modalRef}
      onClick={handleModalClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl p-6 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-border pb-2">
          <h2 className="text-xl font-semibold text-text">
            {event.id ? "Edit Event" : "Add New Event"}
          </h2>
          <button
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-background/70 transition-colors"
          >
            <FaX size={16} className="text-primary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submitEvent)} className="space-y-6">
          <BasicInfoSection register={register} errors={errors} />
          <DateTimeSection register={register} errors={errors} />
          <RecurringSection control={control} watch={watch} />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 flex-wrap">
            <Button variant="outline" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {event.id ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
