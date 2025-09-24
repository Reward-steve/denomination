import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBriefcase,
  FaCalendar,
  FaCross,
  FaPlus,
  FaTrash,
} from "react-icons/fa6";

// Hooks & Context
import { useRegistration } from "../../../hooks/useReg";

// Layout & UI
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";

// Utils & Services
import { getFromStore } from "../../../utils/appHelpers";
import { createUCCAUser } from "../services/auth";

// Types
import type { PersonalInfoFormData } from "../../../types/auth.types";

export default function PrevPosition() {
  const { setStep, setPrev, updateData, data } = useRegistration();
  const navigate = useNavigate();

  // -------------------------
  // Form Setup
  // -------------------------
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      prev_positions: [{ position_name: "", start_year: "", end_year: "" }],
      bio: { bcs_position: "" },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prev_positions",
  });

  // -------------------------
  // Lifecycle
  // -------------------------
  useEffect(() => {
    setStep(5);
    setPrev(true);
  }, [setStep, setPrev]);

  // -------------------------
  // Submit Handler
  // -------------------------
  const onSubmit = async (formData: PersonalInfoFormData) => {
    const userId = getFromStore("ucca_reg_data");
    if (!userId) {
      toast.error("Session expired. Please restart registration.");
      navigate("/auth/personal-info");
      return;
    }

    // Merge into global context
    updateData({
      ...formData,
      bio: {
        ...(data.bio || {}),
        bcs_position: formData.bio?.bcs_position || "",
      },
    });

    const finalPayload = {
      ...data,
      ...formData,
      bio: {
        ...(data.bio || {}),
        bcs_position:
          formData.bio?.bcs_position || data.bio?.bcs_position || "",
      },
    };
    console.log(finalPayload);

    try {
      const res = await createUCCAUser(finalPayload);
      if (res.success) {
        toast.success("🎉 Registration completed successfully!");
        sessionStorage.clear();
        setStep(6);
        navigate("/auth/success");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unexpected error occurred"
      );
    }
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <Form
      title="Your Positions in BCS"
      description="Tell us about your current role and any previous positions you’ve held."
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Current Position (optional) */}
      <FormInput
        label="Current Position (optional)"
        placeholder="e.g. Coordinator"
        icon={FaBriefcase}
        register={register("bio.bcs_position")}
        optional
        error={errors?.bio?.bcs_position}
      />

      {/* Previous Positions */}
      <h3 className="text-base font-semibold text-text mt-6">
        Previous Positions (optional)
      </h3>
      <p className="text-xs text-text-placeholder mb-4">
        Add one or more positions you’ve held in the past. If none, simply skip.
      </p>

      {fields.map((item, index) => (
        <div
          key={item.id}
          className="p-4 border border-border rounded-lg space-y-4 relative mt-4"
        >
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-text">Position #{index + 1}</h4>
            {fields.length > 1 && (
              <Button
                type="button"
                onClick={() => remove(index)}
                variant="ghost"
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </Button>
            )}
          </div>

          {/* Position Name */}
          <FormInput
            label="Position Name"
            placeholder="e.g., Coordinator"
            icon={FaCross}
            register={register(`prev_positions.${index}.position_name`)}
            optional
            error={errors.prev_positions?.[index]?.position_name}
          />

          {/* Years */}
          <FormInput
            label="Start Year"
            placeholder="YYYY"
            type="number"
            icon={FaCalendar}
            register={register(`prev_positions.${index}.start_year`, {
              valueAsNumber: true,
              min: { value: 1900, message: "Year must be >= 1900" },
              max: {
                value: new Date().getFullYear(),
                message: "Year cannot be in the future",
              },
            })}
            optional
            error={errors.prev_positions?.[index]?.start_year}
          />

          <FormInput
            label="End Year"
            placeholder="YYYY"
            type="number"
            icon={FaCalendar}
            register={register(`prev_positions.${index}.end_year`, {
              valueAsNumber: true,
              validate: (value, formValues) => {
                const start = formValues.prev_positions?.[index]?.start_year;
                if (!value) return true; // allow empty
                if (start && value < start) {
                  return "End year cannot be earlier than start year";
                }
                if (Number(value) > new Date().getFullYear()) {
                  return "Year cannot be in the future";
                }
                return true;
              },
            })}
            optional
            error={errors.prev_positions?.[index]?.end_year}
          />
        </div>
      ))}

      {/* Add Another Position */}
      <div className="flex justify-center mt-4">
        <Button
          type="button"
          onClick={() =>
            append({ position_name: "", start_year: "", end_year: "" })
          }
          variant="secondary"
          textSize="sm"
          className="flex items-center gap-2"
        >
          <FaPlus /> Add Another Position
        </Button>
      </div>

      {/* Submit */}
      <Button
        disabled={isSubmitting}
        textSize="sm"
        type="submit"
        variant="auth"
        className="w-full mt-8"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <Loader />
            <span>Saving...</span>
          </div>
        ) : (
          "Finish Registration"
        )}
      </Button>
    </Form>
  );
}
