import type { FieldErrors, UseFormRegister } from "react-hook-form";
import FormInput from "../../../components/ui/FormInput";
import type { Event } from "../types";

export /**
 * Subcomponent: BasicInfoSection
 */
const BasicInfoSection = ({
  register,
  errors,
}: {
  register: UseFormRegister<Event>;
  errors: FieldErrors<Event>;
}) => (
  <div className="border rounded-lg p-4 border-border space-y-4 bg-background">
    <h3 className="font-medium text-text mb-2">Basic Info</h3>
    <FormInput
      id="name"
      label="Event Name"
      placeholder="Event Name"
      register={register("name", { required: "Event name is required" })}
      error={errors.name}
    />
    <FormInput
      id="venue"
      label="Venue"
      placeholder="Event Venue"
      register={register("venue", { required: "Venue is required" })}
      error={errors.venue}
    />
    <FormInput
      id="descr"
      label="Description"
      placeholder="Optional description"
      register={register("descr")}
      error={errors.descr}
      optional
    />
  </div>
);
