import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Hooks & services
import { useRegistration } from "../../../hooks/useReg";
import { fetchPosition } from "../services/auth";

// UI components
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { Dropdown } from "../../../components/ui/Dropdown";
import { CheckboxField } from "../../../components/ui/CheckBoxField";
import { FileUploadField } from "../components/FileUploadfield";

// Icons
import { FaHome, FaCalendar } from "react-icons/fa";
import { FaCross } from "react-icons/fa6";

// Types
import type {
  DropdownOption,
  PersonalInfoFormData,
  Position,
} from "../../../types/auth.types";

// Constants
import { PROMOTION_EVIDENCE } from "../constant";

/**
 * UCCA Information Page
 * --------------------------------------------------
 * Step 4 of Registration flow.
 * Captures the user's UCCA position, promotion,
 * and induction details.
 */
export default function UCCAInfo() {
  const navigate = useNavigate();
  const { setStep, setPrev, updateData } = useRegistration();

  // State for UCCA positions
  const [positions, setPositions] = useState<DropdownOption[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [positionError, setPositionError] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    defaultValues: { bio: { inducted: false } },
  });

  // Watchers for conditional fields
  const inducted = watch("bio.inducted");
  const promotionEvidence = watch("bio.promotion_method");
  console.log(inducted);

  /** Mark this as Step 4 */
  useEffect(() => {
    setStep(4);
    setPrev(true);
  }, [setStep, setPrev]);

  /** Load available UCCA positions */
  useEffect(() => {
    const loadPositions = async () => {
      setLoadingPositions(true);
      try {
        const res = await fetchPosition();

        const enabled = res.data?.filter(
          (pos: Position) => pos.is_enabled === "1"
        );

        // ✅ Normalize ids to string
        setPositions(
          enabled!.map((pos: Position) => ({
            id: String(pos.id),
            name: pos.name,
          }))
        );

        setPositionError(null);
      } catch {
        setPositionError("Unable to load positions. Please try again.");
        toast.error("Failed to fetch UCCA positions.");
      } finally {
        setLoadingPositions(false);
      }
    };

    loadPositions();
  }, []);

  /** Handle form submission */
  const onSubmit = async (formData: PersonalInfoFormData) => {
    try {
      const payload: Partial<PersonalInfoFormData> = {
        bio: {
          ...formData.bio,
          inducted: formData.bio?.inducted ? "1" : "0",
        },
        // ✅ Convert string ids back to numbers
        ucca_position: (formData.ucca_position || []).map((id) => Number(id)),
      };
      console.log(payload);
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
      description="Provide details about your UCCA role, promotion, and induction. This helps us verify your current standing."
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Previous Pew */}
      <FormInput
        label="Previous Pew"
        placeholder="e.g TCW"
        icon={FaHome}
        register={register("bio.previous_pew")}
        optional
        error={errors?.bio?.previous_pew}
      />

      {/* UCCA Position Dropdown */}
      <Controller
        name="ucca_position"
        control={control}
        rules={{ required: "UCCA position is required" }}
        render={({ field, fieldState: { error } }) => (
          <Dropdown
            label="Current UCCA Position"
            placeholder="Select your UCCA position"
            items={positions}
            displayValueKey="name"
            icon={FaCross}
            size="big"
            // ✅ Match selected ids (string[]) with dropdown options
            value={positions.filter((opt) =>
              (field.value || []).includes(opt.id as unknown as number)
            )}
            onSelect={(selected) => {
              if (Array.isArray(selected)) {
                field.onChange(selected.map((item) => item.id));
              } else {
                field.onChange([]);
              }
            }}
            isError={!!error || !!positionError}
            errorMsg={error?.message || positionError || ""}
            loading={loadingPositions}
            disabled={loadingPositions}
            multiple
          />
        )}
      />

      {/* Date of Promotion */}
      <FormInput
        type="date"
        label="Date of Promotion"
        placeholder="MM/DD/YYYY"
        icon={FaCalendar}
        register={register("bio.date_ucca")}
        optional
        error={errors?.bio?.date_ucca}
      />

      {/* Promotion Evidence Dropdown */}
      <Controller
        name="bio.promotion_method"
        control={control}
        rules={{ required: "Promotion evidence is required" }}
        render={({ field, fieldState: { error } }) => (
          <Dropdown
            label="Evidence of Promotion"
            placeholder="Select evidence of promotion"
            items={PROMOTION_EVIDENCE as DropdownOption[]}
            icon={FaCross}
            size="big"
            value={
              PROMOTION_EVIDENCE.find((opt) => opt.name === field.value) as
                | DropdownOption
                | undefined
            }
            onSelect={(selected) => field.onChange(selected?.name)}
            isError={!!error}
            errorMsg={error?.message || ""}
            displayValueKey="name"
          />
        )}
      />

      {/* File Upload (if Father’s Letter chosen) */}
      {promotionEvidence === "Father's Letter" && (
        <FileUploadField
          label="Upload Promotion Letter"
          register={register("bio.promotion_letter")}
        />
      )}

      {/* Inducted Checkbox */}
      <Controller
        name="bio.inducted"
        control={control}
        render={({ field }) => (
          <CheckboxField field={field} label="Have you been inducted?" />
        )}
      />

      {/* Induction Date (only if inducted) */}
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
        type="submit"
        variant="auth"
        className="w-full"
        textSize="sm"
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
