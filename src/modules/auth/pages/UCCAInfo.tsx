import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRegistration } from "../../../hooks/useReg";
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { FaHome } from "react-icons/fa";
import { FaCalendar, FaUpload } from "react-icons/fa6";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import type { PersonalInfoFormData } from "../../../types/auth.types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export function UCCAInfo() {
  const { setStep, setPrev, updateData } = useRegistration();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      bio: {
        inducted: false,
      },
    },
  });

  // Watch fields for conditional rendering
  const inducted = watch("bio.inducted");
  const promotionEvidence = watch("bio.promotion_method");

  // Set step and prev state on mount
  useEffect(() => {
    setStep(4);
    setPrev(true);
  }, [setStep, setPrev]);

  // Form submission handler
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

  // Mock data for dropdown
  const mockPromotionEvidence = [
    { id: "1", name: "Father's Pronouncement" },
    { id: "2", name: "Father's Letter" },
  ];

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

      {/* Evidence of Promotion */}
      <Controller
        name="bio.promotion_method"
        control={control}
        rules={{ required: "Promotion evidence is required" }}
        render={({ field }) => (
          <Dropdown
            label="Evidence of Promotion"
            placeholder="Select evidence"
            items={mockPromotionEvidence}
            displayValueKey="name"
            size="big"
            onSelect={(item) => field.onChange(item.name)}
            isError={!!errors?.bio?.promotion_method}
            errorMsg={errors?.bio?.promotion_method?.message}
            value={field.value}
          />
        )}
      />

      {/* File Upload for Father's Letter */}
      {promotionEvidence === "Father's Letter" && (
        <label
          className={clsx(
            "flex items-center justify-between w-full h-12 px-4 text-sm text-text bg-background border border-border rounded-xl",
            "hover:bg-neutral/10 hover:text-accent transition-all duration-200",
            "focus-within:ring-1 focus-within:ring-accent"
          )}
        >
          <span>Upload Promotion Letter</span>
          <FaUpload className="text-sm text-text-placeholder" />
          <input
            type="file"
            className="hidden"
            {...register("bio.promotion_method")}
          />
        </label>
      )}

      {/* Inducted Checkbox */}
      <Controller
        name="bio.inducted"
        control={control}
        render={({ field }) => (
          <label
            htmlFor="inducted"
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div
              className={clsx(
                "relative w-5 h-5 rounded-md border transition-all duration-200",
                field.value
                  ? "bg-accent border-accent"
                  : "bg-background border-border",
                "hover:border-accent"
              )}
            >
              {field.value && (
                <svg
                  className="w-3 h-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              id="inducted"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
              className="hidden"
            />
            <span className="text-sm text-text">Inducted?</span>
          </label>
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

export default UCCAInfo;
