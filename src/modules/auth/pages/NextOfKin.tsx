import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRegistration } from "../../../hooks/useReg";
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { FaHome } from "react-icons/fa";
import { FaPhone, FaUser } from "react-icons/fa6";
import type { PersonalInfoFormData } from "../../../types/auth.types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { relationships } from "../constant";

/**
 * Next of Kin Information Page
 * --------------------------------------------
 * Step 3 of Registration flow.
 * Collects details of the user's primary contact
 * (Next of Kin) in case of emergencies or records.
 */
export default function NOKInfo() {
  const { setStep, setPrev, updateData } = useRegistration();
  const navigate = useNavigate();

  // --------------------------------------------
  // React Hook Form setup
  // --------------------------------------------
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>();

  // --------------------------------------------
  // Stepper control (mark this as Step 3)
  // --------------------------------------------
  useEffect(() => {
    setStep(3);
    setPrev(true);
  }, [setStep, setPrev]);

  // --------------------------------------------
  // Submit Handler
  // --------------------------------------------
  const onSubmit = async (formData: PersonalInfoFormData) => {
    try {
      const payload = {
        nok: formData.nok,
      };

      // ✅ Save NOK data into context (not API yet)
      updateData(payload);

      toast.success("Next of kin details saved successfully!");
      navigate("/auth/ucca-info"); // Step 4
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  // --------------------------------------------
  // Render
  // --------------------------------------------
  return (
    <Form
      title="Next of Kin Information"
      description="Provide the details of your next of kin. This helps us know who to contact in case of emergencies."
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Full Name */}
      <FormInput
        label="Full Name"
        placeholder="Enter full name of your next of kin"
        icon={FaUser}
        register={register("nok.0.full_name", {
          required: "Full name is required",
        })}
        error={errors?.nok?.[0]?.full_name}
      />

      {/* Phone Number */}
      <FormInput
        label="Phone Number"
        placeholder="Enter valid phone number"
        icon={FaPhone}
        register={register("nok.0.phone", {
          required: "Phone number is required",
          pattern: {
            value: /^\+?[0-9\s-()]+$/,
            message: "Please enter a valid phone number",
          },
        })}
        error={errors?.nok?.[0]?.phone}
      />

      {/* Residential Address */}
      <FormInput
        label="Residential Address"
        placeholder="Enter residential address"
        icon={FaHome}
        register={register("nok.0.address", {
          required: "Residential address is required",
        })}
        error={errors?.nok?.[0]?.address}
      />

      {/* Relationship Dropdown */}
      <Controller
        name="nok.0.relationship"
        control={control}
        rules={{ required: "Relationship is required" }}
        render={({ field }) => (
          <Dropdown
            isError={!!errors?.nok?.[0]?.relationship}
            label="Relationship"
            placeholder="Select relationship"
            items={relationships}
            displayValueKey="name"
            size="big"
            errorMsg={errors?.nok?.[0]?.relationship?.message}
            onSelect={(item) => field.onChange(item.name.toLowerCase())}
            value={field.value}
          />
        )}
      />

      {/* Submit Button */}
      <Button
        disabled={isSubmitting}
        textSize="sm"
        type="submit"
        variant="auth"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <Loader /> <span>Saving...</span>
          </div>
        ) : (
          "Save & Continue"
        )}
      </Button>
    </Form>
  );
}
