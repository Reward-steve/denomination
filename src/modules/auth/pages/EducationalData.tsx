import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useRegistration } from "../../../hooks/useReg";
import Form from "../../../components/layout/Form";
import FormInput from "../../../components/ui/FormInput";
import { FaGraduationCap, FaStar } from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import type { PersonalInfoFormData } from "../../../types/auth.types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ------------------ Types ------------------
type FormValues = Omit<PersonalInfoFormData, "skills"> & {
  skills: { value: string }[];
};

export function EducationData() {
  // ------------------ Hooks ------------------
  const { setStep, setPrev, updateData } = useRegistration();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      education: { certificate: "", study: "" },
      skills: [],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const [skillInput, setSkillInput] = React.useState("");

  // ------------------ Lifecycle ------------------
  React.useEffect(() => {
    setStep(2);
    setPrev(true);
  }, [setStep, setPrev]);

  // ------------------ Helpers ------------------
  const normalize = (s: string) => s.trim().replace(/\s+/g, " ");
  const skillExists = (val: string) =>
    fields.some((f) => f.value?.toLowerCase() === val.toLowerCase());

  // ------------------ Handlers ------------------
  const addSkill = (raw: string) => {
    const val = normalize(raw);
    if (!val) return;

    if (val.length > 40) {
      toast.warn("Skill too long (max 40 chars).");
      return;
    }
    if (skillExists(val)) {
      toast.info("Skill already added.");
      return;
    }

    append({ value: val });
    setSkillInput("");
    trigger("skills");
  };

  const addMany = (raw: string) => {
    const parts = raw
      .split(/,|\n/)
      .map((p) => normalize(p))
      .filter(Boolean);

    if (!parts.length) return;

    let added = 0;
    for (const p of parts) {
      if (!skillExists(p) && p.length <= 40) {
        append({ value: p });
        added++;
      }
    }

    if (added === 0) toast.info("No new skills to add.");
    setSkillInput("");
    trigger("skills");
  };

  const removeSkill = (index: number) => {
    remove(index);
    trigger("skills");
  };

  const onSubmit = async (formData: FormValues) => {
    try {
      const skillsAsStrings = (formData.skills || []).map((s) => s.value);

      const payload = {
        education: { ...formData.education },
        skills: skillsAsStrings,
      };

      updateData(payload);

      toast.success("Education details saved!");
      navigate("/auth/next-of-kin");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  const skillsArrayValidator = register("skills" as any, {
    validate: (v: { value: string }[]) =>
      (v?.length ?? 0) > 0 || "Please add at least one skill.",
  });

  const onSkillKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const onSkillPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const text = e.clipboardData.getData("text");
    if (text && /,|\n/.test(text)) {
      e.preventDefault();
      addMany(text);
    }
  };

  // ------------------ Render ------------------
  return (
    <Form
      title="Education & Skills"
      description="Share your academic background and the skills you bring to the UCCA community."
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Education Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Certificate"
          placeholder="e.g., BSc, MSc"
          error={errors.education?.certificate}
          icon={FaGraduationCap}
          register={register("education.certificate", {
            required: "Certificate is required",
            maxLength: { value: 80, message: "Max 80 characters." },
          })}
        />
        <FormInput
          label="Field of Study"
          placeholder="e.g., Computer Science"
          error={errors.education?.study}
          icon={FaGraduationCap}
          register={register("education.study", {
            required: "Field of study is required",
            maxLength: { value: 80, message: "Max 80 characters." },
          })}
        />
      </div>

      {/* Skills Section */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Skills</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <FaStar className="opacity-60" />
            </span>
            <input
              type="text"
              className={`pl-10 h-[52px] rounded-xl transition-all duration-200 focus:ring-2 border text-sm w-full outline-none bg-surface ${
                errors.skills
                  ? "border-error focus:border-error focus:ring-red-400 animate-shake"
                  : "border-border text-text focus:border-accent focus:ring-accent"
              }`}
              placeholder="Type a skill and press Enter (or paste comma-separated)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={onSkillKeyDown}
              onPaste={onSkillPaste}
              aria-label="Add a skill"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            textSize="sm"
            onClick={() => addSkill(skillInput)}
            className="rounded-xl"
          >
            Add +
          </Button>
        </div>

        {/* Hidden input for validation */}
        <input type="hidden" {...skillsArrayValidator} />

        {/* Skill Chips */}
        {fields.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {fields.map((field, idx) => (
              <span
                key={field.id}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-surface shadow-sm"
              >
                {field.value}
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="rounded-full px-2 py-0.5 text-red-600 hover:bg-red-100 transition"
                  aria-label={`Remove ${field.value}`}
                  title="Remove"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Validation error */}
        {errors?.skills && (
          <p className="mt-1 text-xs text-error animate-shake">
            {String(errors.skills.message || "Please add atleast one skill")}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        disabled={isSubmitting}
        textSize="sm"
        type="submit"
        variant="auth"
        className="mt-6"
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

export default EducationData;
