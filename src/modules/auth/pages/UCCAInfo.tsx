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
import { createUCCAUser } from "../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getFromStore } from "../../../utils/appHelpers";

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
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      previous_pew: "",
      date_ucca: "",
      promotion_method: "",
      inducted: false,
      induction_date: "",
    },
  });

  // Watch for changes in the 'inducted' and 'promotion_method' fields
  const inducted = watch("inducted");
  const promotionEvidence = watch("promotion_method");

  useEffect(() => {
    setStep(4);
    setPrev(true);
  }, [setStep, setPrev]);

  const onSubmit = async (formData: PersonalInfoFormData) => {
    try {
      const userId = getFromStore("user_id", "session");

      const payload = {
        user_id: Number(userId),
        previous_pew: formData.previous_pew || null,
        date_ucca: formData.date_ucca || null,
        promotion_method: formData.promotion_method || null,
        inducted: !!formData.inducted, // force boolean
        induction_date: formData.induction_date || null,
      };

      const res = await createUCCAUser(payload);
      console.log(res.data?.id, res.data);
      if (res.success) {
        updateData(formData);
        toast.success(res.message);
        navigate("/auth/prev-position");
      } else {
        toast.error(res.message);
      }
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
        register={register("previous_pew")}
        optional={true}
        error={errors.previous_pew}
      />
      <FormInput
        label="Date of Promotion to UCCA"
        placeholder="YYYY-MM-DD"
        type="date"
        icon={FaCalendar}
        register={register("date_ucca", {
          required: "Date of promotion is required",
        })}
        error={errors.date_ucca}
      />
      <Controller
        name="promotion_method"
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
            isError={!!errors.promotion_method}
            errorMsg={errors.promotion_method?.message}
            value={field.value}
          />
        )}
      />
      {promotionEvidence === "Father's Letter" && (
        <label className="text-sm w-full hover:bg-neutral hover:text-primary gap-2 outline-none bg-background border border-border rounded-xl flex justify-center items-center  pr-10 h-[52px] transition-all duration-200 focus:ring-1">
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
          {...register("inducted")}
        />
        <label htmlFor="inducted" className="text-gray-700 flex items-center">
          Inducted?
        </label>
      </div>
      {inducted && (
        <FormInput
          label="Induction Date"
          placeholder="YYYY-MM-DD"
          type="date"
          icon={FaCalendar}
          register={register("induction_date", {
            required: "Induction date is required",
          })}
          error={errors.induction_date}
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
