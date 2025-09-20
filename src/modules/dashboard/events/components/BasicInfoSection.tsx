import type { FieldErrors, UseFormRegister } from "react-hook-form";
import FormInput from "../../../../components/ui/FormInput";
import type { Event } from "../../types";

interface BasicInfoSectionProps {
  register: UseFormRegister<Event>;
  errors: FieldErrors<Event>;
}

/**
 * Section: BasicInfoSection
 * Collects essential event details like name, venue, and description.
 */
export const BasicInfoSection = ({
  register,
  errors,
}: BasicInfoSectionProps) => {
  return (
    <section
      className="border rounded-lg p-3 sm:p-4 md:p-5 border-border space-y-4 bg-background"
      aria-labelledby="basic-info-title"
    >
      <h3
        id="basic-info-title"
        className="text-base sm:text-lg font-medium text-text-placeholder mb-2"
      >
        Basic Info
      </h3>

      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
        <FormInput
          id="name"
          label="Event Name"
          placeholder="Enter event name"
          register={register("name", { required: "Event name is required" })}
          error={errors.name}
        />

        <FormInput
          id="venue"
          label="Venue"
          placeholder="Enter event venue"
          register={register("venue", { required: "Venue is required" })}
          error={errors.venue}
        />
      </div>

      <FormInput
        id="descr"
        label="Description"
        placeholder="Optional description"
        register={register("descr")}
        error={errors.descr}
        optional
      />
    </section>
  );
};
