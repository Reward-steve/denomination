import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRegistration } from "../../../hooks/useReg";
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { FaHome, FaCalendar } from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { CheckboxField } from "../components/CheckBoxField";
import { FileUploadField } from "../components/FileUploadfield";
import { DropdownField } from "../components/UCCADropdown";
import { PROMOTION_EVIDENCE } from "../constant";
import type { PersonalInfoFormData } from "../../../types/auth.types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function UCCAInfo() {
  const { setStep, setPrev, updateData } = useRegistration();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    defaultValues: { bio: { inducted: false } },
  });

  const inducted = watch("bio.inducted");
  const promotionEvidence = watch("bio.promotion_method");

  useEffect(() => {
    setStep(4);
    setPrev(true);
  }, [setStep, setPrev]);

  const onSubmit = async (formData: PersonalInfoFormData) => {
    try {
      const payload = {
        bio: {
          ...formData.bio,
          inducted: formData.bio?.inducted ? 1 : 0,
        },
      };
      updateData(payload);
      toast.success("UCCA details saved!");
      navigate("/auth/prev-position");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  return (
    <Form
      title="UCCA Information"
      description="Please provide details about your UCCA status."
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Previous Pew */}
      <FormInput
        label="Previous Pew"
        placeholder="Enter previous pew (e.g., UCCA Zone 1)"
        icon={FaHome}
        register={register("bio.previous_pew")}
        optional
        error={errors?.bio?.previous_pew}
      />

      {/* Date of Promotion */}
      <FormInput
        type="date"
        label="Date of Promotion to UCCA"
        placeholder="MM/DD/YYYY"
        icon={FaCalendar}
        register={register("bio.date_ucca")}
        optional
        error={errors?.bio?.date_ucca}
      />

      {/* Promotion Evidence */}
      <Controller
        name="bio.promotion_method"
        control={control}
        rules={{ required: "Promotion evidence is required" }}
        render={({ field }) => (
          <DropdownField
            field={field}
            label="Evidence of Promotion"
            items={PROMOTION_EVIDENCE as { id: string; name: string }[]} // 👈 cast
            displayValueKey="name"
            error={errors?.bio?.promotion_method?.message}
          />
        )}
      />

      {/* File Upload for Father's Letter */}
      {promotionEvidence === "Father's Letter" && (
        <FileUploadField
          label="Upload Promotion Letter"
          register={register("bio.promotion_method")}
        />
      )}

      {/* Inducted Checkbox */}
      <Controller
        name="bio.inducted"
        control={control}
        render={({ field }) => (
          <CheckboxField field={field} label="Inducted?" />
        )}
      />

      {/* Induction Date */}
      {inducted && (
        <FormInput
          type="date"
          label="Induction Date"
          placeholder="MM/DD/YYYY"
          icon={FaCalendar}
          register={register("bio.induction_date")}
          optional
          error={errors?.bio?.induction_date}
        />
      )}

      {/* Submit Button */}
      <Button
        disabled={isSubmitting}
        textSize="sm"
        type="submit"
        variant="auth"
        className="w-full"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader />
            <span>Saving...</span>
          </div>
        ) : (
          "Save & Continue"
        )}
      </Button>
    </Form>
  );
}
