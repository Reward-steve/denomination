import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Context & Hooks
import { useRegistration } from "../../../hooks/useReg";

// Layout & UI
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";

// Icons
import { FaUser, FaPhone } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";

// Types & Constants
import type { PersonalInfoFormData } from "../../../types/auth.types";
import { relationships } from "../constant";
import { MdFamilyRestroom } from "react-icons/md";

/**
 * Next of Kin Information Page
 * ----------------------------
 * Step 3 of registration.
 * Collects details of the user's emergency contact.
 */
export default function NOKInfo() {
  const { setStep, setPrev, updateData } = useRegistration();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>();

  // Stepper: mark this page as step 3
  useEffect(() => {
    setStep(3);
    setPrev(true);
  }, [setStep, setPrev]);

  // Handle form submit
  const onSubmit = async (formData: PersonalInfoFormData) => {
    try {
      updateData({ nok: formData.nok });
      toast.success("Next of kin details saved!");
      navigate("/auth/ucca-info"); // go to Step 4
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  };

  return (
    <Form
      title="Next of Kin Information"
      description="Provide the details of your next of kin. This person will be contacted in case of an emergency."
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Full Name */}
      <FormInput
        label="Full Name"
        placeholder="e.g., John Doe"
        icon={FaUser}
        register={register("nok.0.full_name", {
          required: "Full name is required",
        })}
        error={errors?.nok?.[0]?.full_name}
      />

      {/* Phone Number */}
      <FormInput
        label="Phone Number"
        placeholder="e.g., +234 812 345 6789"
        icon={FaPhone}
        register={register("nok.0.phone", {
          required: "Phone number is required",
          pattern: {
            value: /^\+?[0-9\s-()]+$/,
            message: "Enter a valid phone number",
          },
        })}
        error={errors?.nok?.[0]?.phone}
      />

      {/* Address */}
      <FormInput
        label="Residential Address"
        placeholder="Enter their full home address"
        icon={FaHome}
        register={register("nok.0.address", {
          required: "Residential address is required",
        })}
        error={errors?.nok?.[0]?.address}
      />

      {/* Relationship */}
      <Controller
        name="nok.0.relationship"
        control={control}
        rules={{ required: "Relationship is required" }}
        render={({ field, fieldState: { error } }) => (
          <Dropdown
            isError={!!errors?.nok?.[0]?.relationship}
            label="Relationship"
            placeholder="Select relationship"
            items={relationships}
            displayValueKey="name"
            size="big"
            errorMsg={error?.message}
            onSelect={(item) => {
              if (!item || Array.isArray(item)) return;
              field.onChange(item.name);
            }}
            icon={MdFamilyRestroom}
            value={relationships.find((item) => item.name === field.value)}
          />
        )}
      />

      {/* Submit */}
      <Button
        disabled={isSubmitting}
        textSize="sm"
        type="submit"
        variant="auth"
        className="w-full"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader /> <span>Saving...</span>
          </div>
        ) : (
          "Save & Continue"
        )}
      </Button>
    </Form>
  );
}
