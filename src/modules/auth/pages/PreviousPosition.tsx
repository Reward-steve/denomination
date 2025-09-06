import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRegistration } from "../../../hooks/useReg";
import Form from "../../../components/layout/Form";
import { FaBriefcase, FaCalendar, FaPlus, FaTrash } from "react-icons/fa6";
import FormInput from "../../../components/ui/FormInput";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import type { PersonalInfoFormData } from "../../../types/auth.types";
import { createUCCAUser } from "../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getFromStore } from "../../../utils/appHelpers";

// The PrevPosition component
export function PrevPosition() {
  const { setStep, setPrev, updateData } = useRegistration();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      prev_positions: [],
      bcs_position: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prev_positions",
  });

  useEffect(() => {
    setStep(5);
    setPrev(true);
  }, [setStep, setPrev]);

  const onSubmit = async (formData: PersonalInfoFormData) => {
    try {
      const userId = getFromStore("user_id", "session");

      const payload = {
        user_id: Number(userId),
        prev_positions: { ...formData.prev_positions },
        bcs_position: formData.bcs_position,
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

  return (
    <Form
      title="Previous Positions"
      description="Please provide details about your past and current positions held in BCS."
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* New section for Previous Positions */}
      <div className="text-center mt-10">
        <p className="mt-2 text-gray-600">
          List any previous positions you held in the BCS.
        </p>
      </div>

      {fields.map((item, index) => (
        <div
          key={item.id}
          className="p-4 border border-gray-200 rounded-lg space-y-4 relative"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-800">
              Position #{index + 1}
            </h4>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200"
              aria-label="Remove position"
            >
              <FaTrash />
            </button>
          </div>
          <FormInput
            label="Position Name"
            placeholder="e.g., Senior Apostle"
            icon={FaBriefcase}
            register={register(`prev_positions.${index}.position_name`, {
              required: "Position name is required",
            })}
            error={errors.prev_positions?.[index]?.position_name}
          />
          <FormInput
            label="Start Year"
            placeholder="YYYY"
            type="number"
            icon={FaCalendar}
            register={register(`prev_positions.${index}.start_year`, {
              required: "Start year is required",
            })}
            error={errors.prev_positions?.[index]?.start_year}
          />
          <FormInput
            label="End Year"
            placeholder="YYYY"
            type="number"
            icon={FaCalendar}
            register={register(`prev_positions.${index}.end_year`, {
              required: "End year is required",
            })}
            error={errors.prev_positions?.[index]?.end_year}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          append({ position_name: "", start_year: "", end_year: "" });
        }}
        className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
      >
        <FaPlus className="mr-2" /> Add Another Position
      </button>

      <FormInput
        label="Current Position held in BCS"
        placeholder="e.g., UCCA President"
        icon={FaBriefcase}
        register={register("bcs_position")}
        optional={true}
        error={errors.bcs_position}
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

export default PrevPosition;
