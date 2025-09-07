import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRegistration } from "../../../hooks/useReg";
import Form from "../../../components/layout/Form";
import { FaBriefcase, FaCalendar, FaPlus, FaTrash } from "react-icons/fa6";
import FormInput from "../../../components/ui/FormInput";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { type PersonalInfoFormData } from "../../../types/auth.types";
import { createUCCAUser } from "../services/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getFromStore } from "../../../utils/appHelpers";

// The PrevPosition component
export function PrevPosition() {
  const { setStep, setPrev, updateData, data } = useRegistration();
  const [id, setId] = useState(true);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prev_positions",
  });

  useEffect(() => {
    setStep(5);
    setPrev(true);
  }, [setStep, setPrev]);

  const onSubmit = async (formData: Partial<PersonalInfoFormData>) => {
    const userId = getFromStore("ucca_reg_data");
    try {
      if (!userId) {
        toast.error("User session lost. Please restart registration.");
        setId(false);
        return;
      }
      // Save step 5 data into context
      updateData({
        prev_positions: formData.prev_positions,
        bio: {
          ...(data.bio || {}),
          bcs_position:
            formData.bio?.bcs_position || data.bio?.bcs_position || "",
        },
      });
      // Build final payload from all context data
      const finalPayload = {
        ...data,
        prev_positions: formData.prev_positions,
        bio: {
          ...(data.bio || {}),
          bcs_position:
            formData.bio?.bcs_position || data.bio?.bcs_position || "",
        },
      };

      console.log(data, finalPayload);

      const res = await createUCCAUser(finalPayload);
      console.log("Response:", res);
      if (res.success) {
        toast.success("Registration completed successfully!");
        // 🔥 Clear registration state after success
        sessionStorage.removeItem("ucca_reg_step");
        sessionStorage.removeItem("ucca_reg_prev");
        sessionStorage.removeItem("ucca_reg_data");
        setStep(6);
        navigate("/auth/success");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  return (
    <>
      {id ? (
        ""
      ) : (
        <Button
          className="absolute top-5 right-4 z-50 text-accent"
          variant="outline"
          textSize="xs"
          onClick={() => navigate("/auth/personal-info")}
        >
          Restart
        </Button>
      )}
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
          register={register("bio.bcs_position")}
          optional={true}
          error={errors?.bio?.bcs_position}
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
    </>
  );
}

export default PrevPosition;
