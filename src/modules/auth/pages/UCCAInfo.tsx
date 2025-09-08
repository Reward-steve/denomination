import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRegistration } from "../../../hooks/useReg";
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { FaHome } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import type { PersonalInfoFormData } from "../../../types/auth.types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import FormInputDate from "../../../components/ui/FormInputDate";

// The UCCAInfo component
export function UCCAInfo() {
  const { setStep, setPrev, updateData } = useRegistration();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>();

  // Watch for changes in the 'inducted' and 'promotion_method' fields
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

      // ✅ Just update context — no API call yet
      updateData(payload);

      toast.success("UCCA details saved!");
      navigate("/auth/prev-position"); // move to next step
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

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
      <FormInput
        label="Previous Pew"
        placeholder="Enter previous pew (e.g., UCCA Zone 1)"
        icon={FaHome}
        register={register("bio.previous_pew")}
        optional={true}
        error={errors?.bio?.previous_pew}
      />

      <FormInputDate
        control={control}
        name="bio.date_ucca"
        label="Date of Promotion to UCCA"
        error={errors?.bio?.date_ucca}
      />
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
      {promotionEvidence === "Father's Letter" && (
        <label className="text-sm w-full hover:bg-neutral hover:text-accent gap-2 outline-none bg-background border border-border rounded-xl flex justify-center items-center  pr-10 h-[52px] transition-all duration-200 focus:ring-1">
          Upload Promotion Letter
          <FaUpload className="text-sm text-textPlaceholder" />
          <input type="file" className="hidden" />
        </label>
      )}

      <div className="flex items-center space-x-2 mt-4">
        <input
          type="checkbox"
          id="inducted"
          className="form-checkbox text-blue-600 rounded-md"
          {...register("bio.inducted")}
        />
        <label htmlFor="inducted" className="text-gray-700 flex items-center">
          Inducted?
        </label>
      </div>
      {inducted && (
        <FormInputDate
          control={control}
          name="bio.induction_date"
          label="Induction Date"
          error={errors?.bio?.induction_date}
        />
      )}

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

export default UCCAInfo;
