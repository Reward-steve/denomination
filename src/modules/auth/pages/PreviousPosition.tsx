import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
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
import { Dropdown } from "../../../components/ui/Dropdown";

// Utils & Services
import { getFromStore } from "../../../utils/appHelpers";
import { createUCCAUser, fetchPosition } from "../services/auth";

// Types
import {
  type DropdownOption,
  type PersonalInfoFormData,
  type Position,
} from "../../../types/auth.types";

// -------------------------
// Helper: Build Final Payload
// -------------------------
const buildFinalPayload = (
  data: PersonalInfoFormData,
  formData: Partial<PersonalInfoFormData>
) => ({
  ...data,
  prev_positions: formData.prev_positions,
  bio: {
    ...(data.bio || {}),
    bcs_position: formData.bio?.bcs_position || data.bio?.bcs_position || "",
  },
});

// -------------------------
// Component
// -------------------------
export function PrevPosition() {
  const { setStep, setPrev, updateData, data } = useRegistration();
  const [hasSession, setHasSession] = useState(true);
  const [priestStatusOptions, setPriestStatusOptions] = useState<
    DropdownOption[]
  >([]);
  const [positionError, setPositionError] = useState<string | null>(null);
  const [isLoadingPositions, setIsLoadingPositions] = useState(false);

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

  // -------------------------
  // Lifecycle
  // -------------------------
  useEffect(() => {
    setStep(5);
    setPrev(true);
  }, [setStep, setPrev]);

  useEffect(() => {
    const loadPositions = async () => {
      setIsLoadingPositions(true);
      try {
        const res = await fetchPosition();
        const options: DropdownOption[] = res
          .data!.filter((pos: Position) => pos.is_enabled === "1")
          .map((pos: Position) => ({
            id: pos.id.toString(),
            name: pos.name,
          }));
        setPriestStatusOptions(options);
        setPositionError(null);
      } catch {
        setPositionError("Failed to load priest positions. Please try again.");
        toast.error("Failed to load priest positions.");
      } finally {
        setIsLoadingPositions(false);
      }
    };

    loadPositions();
  }, []);

  // -------------------------
  // Handlers
  // -------------------------
  const onSubmit = async (formData: Partial<PersonalInfoFormData>) => {
    const userId = getFromStore("ucca_reg_data");
    if (!userId) {
      toast.error("User session lost. Please restart registration.");
      setHasSession(false);
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

    const finalPayload = buildFinalPayload(data, formData);

    try {
      const res = await createUCCAUser(finalPayload);
      if (res.success) {
        toast.success("Registration completed successfully!");
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

  // -------------------------
  // Render
  // -------------------------
  return (
    <>
      {!hasSession && (
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
        <div className="text-center mt-10">
          <p className="mt-2 text-text-placeholder">
            List any previous positions you held in the BCS.
          </p>
        </div>

        {fields.map((item, index) => (
          <div
            key={item.id}
            className="p-4 border border-border rounded-lg space-y-4 relative"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-text">Position #{index + 1}</h4>
              <Button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
                aria-label="Remove position"
              >
                <FaTrash />
              </Button>
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

        <Controller
          name="bio.bcs_position"
          control={control}
          rules={{ required: "Priest status is required" }}
          render={({ field, fieldState: { error } }) => (
            <Dropdown
              isError={!!error || !!positionError}
              label="Priest Status"
              placeholder="Select Priest Status"
              items={priestStatusOptions}
              displayValueKey="name"
              size="big"
              errorMsg={error?.message || positionError || ""}
              onSelect={(item) => field.onChange(item.name)}
              value={field.value}
              icon={FaCross}
              loading={isLoadingPositions}
              disabled={isLoadingPositions || !!positionError}
            />
          )}
        />

        <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center gap-3 sm:gap-6 mt-6">
          <Button
            disabled={isSubmitting}
            textSize="sm"
            type="submit"
            variant="primary"
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <Loader /> <span>Saving...</span>
              </div>
            ) : (
              "Save & Continue"
            )}
          </Button>

          <Button
            type="button"
            onClick={() =>
              append({ position_name: "", start_year: "", end_year: "" })
            }
            variant="secondary"
            textSize="sm"
            className="w-full sm:w-auto flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Add Another Position
          </Button>
        </div>
      </Form>
    </>
  );
}

export default PrevPosition;
