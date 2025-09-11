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

export function PrevPosition() {
  const { setStep, setPrev, updateData, data } = useRegistration();
  const [hasSession, setHasSession] = useState(true);
  const [positions, setPositions] = useState<DropdownOption[]>([]);
  const [positionError, setPositionError] = useState<string | null>(null);
  const [loadingPositions, setLoadingPositions] = useState(false);

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
      setLoadingPositions(true);
      try {
        const res = await fetchPosition();
        const enabled = res.data?.filter(
          (pos: Position) => pos.is_enabled === "1"
        );
        setPositions(
          enabled!.map((pos: Position) => ({
            id: pos.id.toString(),
            name: pos.name,
          }))
        );
        setPositionError(null);
      } catch {
        setPositionError("Unable to load positions. Please try again.");
        toast.error("Failed to fetch positions");
      } finally {
        setLoadingPositions(false);
      }
    };

    loadPositions();
  }, []);

  // -------------------------
  // Submit Handler
  // -------------------------
  const onSubmit = async (formData: Partial<PersonalInfoFormData>) => {
    const userId = getFromStore("ucca_reg_data");
    if (!userId) {
      toast.error("Session expired. Please restart registration.");
      setHasSession(false);
      return;
    }

    // Update context
    updateData({
      prev_positions: formData.prev_positions,
      bio: {
        ...(data.bio || {}),
        bcs_position: formData.bio?.bcs_position || "",
      },
    });

    // Final payload
    const finalPayload = {
      ...data,
      prev_positions: formData.prev_positions,
      bio: {
        ...(data.bio || {}),
        bcs_position:
          formData.bio?.bcs_position || data.bio?.bcs_position || "",
      },
    };

    try {
      const res = await createUCCAUser(finalPayload);
      if (res.success) {
        toast.success("Registration completed successfully!");
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
        title="Previous Positions in BCS"
        description="Tell us about positions you’ve held previously, as well as your current role."
        onSubmit={handleSubmit(onSubmit)}
      >
        {fields.length === 0 && (
          <p className="text-sm text-text-placeholder text-center mt-4">
            No positions added yet. Click below to add your first.
          </p>
        )}

        {fields.map((item, index) => (
          <div
            key={item.id}
            className="p-4 border border-border rounded-lg space-y-4 relative mt-6"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-text">Position #{index + 1}</h4>
              <Button
                type="button"
                onClick={() => remove(index)}
                variant="ghost"
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </Button>
            </div>

            {/* Position Dropdown */}
            <Controller
              name={`prev_positions.${index}.position_name`}
              control={control}
              rules={{ required: "Position name is required" }}
              render={({ field, fieldState: { error } }) => (
                <Dropdown
                  isError={!!error || !!positionError}
                  label="Position Name"
                  placeholder="Select Position"
                  items={positions}
                  displayValueKey="name"
                  size="big"
                  errorMsg={error?.message || positionError || ""}
                  onSelect={(item) => field.onChange(item.name)}
                  value={field.value}
                  icon={FaCross}
                  loading={loadingPositions}
                  disabled={loadingPositions || !!positionError}
                />
              )}
            />

            {/* Years */}
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

        {/* Current Position */}
        <FormInput
          label="Current Position"
          placeholder="e.g., Senior Apostle"
          icon={FaBriefcase}
          register={register(`bio.bcs_position`, {
            required: "Current position is required",
          })}
          error={errors?.bio?.bcs_position}
        />

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between items-center gap-3 mt-8">
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
            <FaPlus className="mr-2" /> Add Position
          </Button>
        </div>
      </Form>
    </>
  );
}

export default PrevPosition;
