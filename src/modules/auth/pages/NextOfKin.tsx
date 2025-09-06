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

// The NOKInfo component
export default function NOKInfo() {
  const { setStep, setPrev, updateData } = useRegistration();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>();

  useEffect(() => {
    setStep(3);
    setPrev(true);
  }, [setStep, setPrev]);

  const onSubmit = async (formData: PersonalInfoFormData) => {
    try {
      const payload = {
        nok: formData.nok,
      };

      // ✅ Just update context — no API call here
      updateData(payload);

      toast.success("Next of kin details saved!");
      navigate("/auth/ucca-info"); // proceed to step 4
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  const mockRelationships = [
    { id: "1", name: "Father" },
    { id: "2", name: "Mother" },
    { id: "3", name: "Sibling" },
    { id: "4", name: "Spouse" },
    { id: "5", name: "Other" },
  ];

  return (
    <Form
      title="Next of Kin Information"
      description="Please provide the details of your next of kin."
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        label="Full Name"
        placeholder="Enter full name"
        icon={FaUser}
        register={register("nok.0.full_name", {
          required: "Full name is required",
        })}
        error={errors?.nok?.[0]?.full_name}
      />

      <FormInput
        label="Phone Number"
        placeholder="Enter phone number"
        icon={FaPhone}
        register={register("nok.0.phone", {
          required: "Phone number is required",
          pattern: {
            value: /^\+?[0-9\s-()]+$/,
            message: "Invalid phone number format",
          },
        })}
        error={errors?.nok?.[0]?.phone}
      />

      <FormInput
        label="Residential Address"
        placeholder="Enter residential address"
        icon={FaHome}
        register={register("nok.0.address", {
          required: "Residential address is required",
        })}
        error={errors?.nok?.[0]?.address}
      />

      <Controller
        name="nok.0.relationship"
        control={control}
        rules={{ required: "Relationship is required" }}
        render={({ field }) => (
          <Dropdown
            isError={!!errors?.nok?.[0]?.relationship}
            label="Relationship"
            placeholder="Select relationship"
            items={mockRelationships}
            displayValueKey="name"
            size="big"
            errorMsg={errors?.nok?.[0]?.relationship?.message}
            onSelect={(item) => field.onChange(item.name.toLowerCase())}
            value={field.value}
          />
        )}
      />

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
