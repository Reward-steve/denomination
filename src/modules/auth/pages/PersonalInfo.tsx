import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Types
import {
  type PersonalInfoFormData,
  type LGA,
  type States,
  type DropdownOption,
} from "../../../types/auth.types";

// Hooks & Context
import { useRegistration } from "../../../hooks/useReg";

// Layout & UI
import Form from "../../../components/layout/Form";
import ImageUploader from "../components/ImageUploader";
import FormInput from "../../../components/ui/FormInput";
import { Dropdown } from "../../../components/ui/Dropdown";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";

// Services
import { fetchStates, fetchLGA } from "../services/auth";

// Icons
import {
  FaHeart,
  FaLock,
  FaMapPin,
  FaPhone,
  FaUser,
  FaVenusMars,
  FaRing,
  FaCross,
  FaCalendar,
} from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { GoMail } from "react-icons/go";
import type { IconType } from "react-icons";

// -------------------------
// Dropdown Options
// -------------------------
const genderOptions: DropdownOption[] = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];

const maritalStatusOptions: DropdownOption[] = [
  { id: "single", name: "Single" },
  { id: "married", name: "Married" },
  { id: "separated", name: "Separated" },
];

const priestStatusOptions: DropdownOption[] = [
  { id: "posted", name: "Posted" },
  { id: "yet_to_be_posted", name: "Yet to be Posted" },
];

// -------------------------
// Component
// -------------------------
function PersonalInfo() {
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [states, setStates] = useState<States[]>([]);
  const [lgas, setLgas] = useState<LGA[]>([]);
  const [selectedStateId, setSelectedStateId] = useState("");

  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingLgas, setIsLoadingLgas] = useState(false);
  const [stateError, setStateError] = useState<string | null>(null);
  const [lgaError, setLgaError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { setStep, setPrev, updateData } = useRegistration();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      bio: {
        first_name: "",
        middle_name: "",
        last_name: "",
        dob: "",
        gender: "",
        marital_status: "",
        phone: "",
        secondary_phone: "",
        residential_address: "",
        email: "",
        lga: "",
        origin_state: "",
        city: "",
        residence_state: "",
        area: "",
        bethel: "",
        zone: "",
        priest_status: "",
        hobbies: "",
        password: "",
        confirm_password: "",
      },
    },
  });

  const password = watch("bio.password");

  // ----------------- Lifecycle -----------------
  useEffect(() => {
    setStep(1);
    setPrev(false);
  }, [setStep, setPrev]);

  // Load states
  useEffect(() => {
    const loadStates = async () => {
      setIsLoadingStates(true);
      try {
        const res = await fetchStates();
        setStates(res.data ?? []);
        setStateError(null);
      } catch {
        setStateError("Could not load states.");
        toast.error("Failed to fetch states.");
      } finally {
        setIsLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  // Load LGAs when state changes
  useEffect(() => {
    const loadLgas = async () => {
      if (!selectedStateId) {
        setLgas([]);
        setValue("bio.lga", "");
        return;
      }
      setIsLoadingLgas(true);
      try {
        const res = await fetchLGA(selectedStateId);
        if (res.success) {
          setLgas(res.data ?? []);
          setLgaError(null);
        } else {
          setLgaError(res.message || "Failed to load LGAs.");
          toast.error(res.message || "Could not fetch LGAs.");
        }
      } catch {
        setLgaError("Could not load LGAs.");
        toast.error("Error fetching LGAs.");
      } finally {
        setIsLoadingLgas(false);
      }
    };
    loadLgas();
  }, [selectedStateId, setValue]);

  // ----------------- Handlers -----------------
  const onSubmit = (formData: PersonalInfoFormData) => {
    if (!imageFile) {
      toast.error("Profile photo is required.");
      return;
    }

    console.log({ ...formData });

    const payload = { ...formData };

    try {
      updateData(payload);
      toast.success("Personal information saved!");
      navigate("/auth/education-data");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unexpected error occurred"
      );
    }
  };

  const renderDropdown = (
    name: keyof PersonalInfoFormData["bio"],
    label: string,
    items: DropdownOption[],
    icon: IconType,
    extra?: {
      error?: string | null;
      loading?: boolean;
      disabled?: boolean;
      onChange?: (item: DropdownOption) => void;
    }
  ) => (
    <Controller
      name={`bio.${name}` as const}
      control={control}
      rules={{ required: `Please select ${label.toLowerCase()}` }}
      render={({ field, fieldState: { error } }) => (
        <Dropdown
          isError={!!error || !!extra?.error}
          label={label}
          placeholder={`Select ${label.toLowerCase()}`}
          items={items}
          displayValueKey="name"
          errorMsg={error?.message || extra?.error || ""}
          onSelect={(item) => {
            if (!item || Array.isArray(item)) return;
            field.onChange(item.name);
            extra?.onChange?.(item);
          }}
          value={items.find((item) => item.name === field.value)}
          icon={icon}
          loading={extra?.loading}
          disabled={extra?.disabled}
        />
      )}
    />
  );

  return (
    <Form
      title="Personal Information"
      description="Fill in accurate personal details. These form the foundation of your UCCA profile."
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Profile Photo */}
      <Controller
        name="photo"
        control={control}
        rules={{ required: "Profile photo is required" }}
        render={({ field, fieldState: { error } }) => (
          <ImageUploader
            message="Upload your photo"
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            setImageFile={(file) => {
              field.onChange(file);
              setImageFile(file);
            }}
            error={error?.message}
          />
        )}
      />

      {/* Basic Details */}
      <section className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-800">Basic Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            placeholder="Enter first name"
            icon={FaUser}
            register={register("bio.first_name", {
              required: "First name is required",
            })}
            error={errors.bio?.first_name}
          />
          <FormInput
            optional
            label="Middle Name"
            placeholder="Enter middle name"
            icon={FaUser}
            register={register("bio.middle_name")}
            error={errors.bio?.middle_name}
          />
          <FormInput
            label="Last Name"
            placeholder="Enter last name"
            icon={FaUser}
            register={register("bio.last_name", {
              required: "Last name is required",
            })}
            error={errors.bio?.last_name}
          />
          <FormInput
            type="date"
            label="Date of Birth"
            icon={FaCalendar}
            register={register("bio.dob", {
              required: "Date of birth is required",
            })}
            error={errors.bio?.dob}
          />

          {renderDropdown("gender", "Gender", genderOptions, FaVenusMars)}
          {renderDropdown(
            "marital_status",
            "Marital Status",
            maritalStatusOptions,
            FaRing
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-800">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Mobile Number"
            placeholder="Primary number"
            icon={FaPhone}
            register={register("bio.phone", {
              required: "Phone number is required",
              pattern: { value: /^\d+$/, message: "Enter a valid number" },
            })}
            error={errors.bio?.phone}
          />
          <FormInput
            optional
            label="Secondary Number"
            placeholder="Optional"
            icon={FaPhone}
            register={register("bio.secondary_phone")}
            error={errors.bio?.secondary_phone}
          />
          <FormInput
            label="Home Address"
            placeholder="Residential address"
            icon={FaHome}
            register={register("bio.residential_address", {
              required: "Address is required",
            })}
            error={errors.bio?.residential_address}
          />
          <FormInput
            type="email"
            label="Email"
            placeholder="example@email.com"
            icon={GoMail}
            register={register("bio.email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            error={errors.bio?.email}
          />
        </div>
      </section>

      {/* Geographic Information */}
      <section className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-800">
          Geographic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="City of Residence"
            placeholder="Enter City"
            icon={FaMapPin}
            register={register("bio.city", { required: "City is required" })}
            error={errors.bio?.city}
          />
          <FormInput
            label="Nationality"
            value="Nigeria"
            disabled
            icon={FaMapPin}
            register={register("bio.nationality")}
          />

          {renderDropdown(
            "origin_state",
            "State of Origin",
            states as unknown as DropdownOption[],
            FaMapPin,
            {
              error: stateError,
              loading: isLoadingStates,
              disabled: isLoadingStates,
              onChange: (item) => {
                setSelectedStateId(item?.id as unknown as string);
                setValue("bio.origin_state", item.name);
                setValue("bio.lga", "");
              },
            }
          )}

          {renderDropdown(
            "lga",
            "LGA",
            lgas as unknown as DropdownOption[],
            FaMapPin,
            {
              error: lgaError,
              loading: isLoadingLgas,
              disabled: selectedStateId === "" || isLoadingLgas,
              onChange: (item) => {
                setValue("bio.lga", item.name);
              },
            }
          )}
        </div>
      </section>

      {/* Additional Info */}
      <section className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-800">
          Additional Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderDropdown(
            "priest_status",
            "Priest Status",
            priestStatusOptions,
            FaCross
          )}
          <FormInput
            optional
            label="Hobbies"
            placeholder="e.g., Reading, Singing"
            icon={FaHeart}
            register={register("bio.hobbies")}
            error={errors.bio?.hobbies}
          />
        </div>
      </section>

      {/* Account Details */}
      <section className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-800">Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Password"
            placeholder="Enter password"
            type="password"
            icon={FaLock}
            register={register("bio.password", {
              required: "Password is required",
              minLength: { value: 6, message: "Must be at least 6 characters" },
            })}
            error={errors.bio?.password}
          />
          <FormInput
            label="Confirm Password"
            placeholder="Re-enter password"
            type="password"
            icon={FaLock}
            register={register("bio.confirm_password", {
              required: "Confirm password is required",
              validate: (val) => val === password || "Passwords do not match",
            })}
            error={errors.bio?.confirm_password}
          />
        </div>
      </section>

      <Button
        disabled={isSubmitting || isLoadingStates || isLoadingLgas}
        textSize="sm"
        type="submit"
        variant="auth"
      >
        {isSubmitting || isLoadingStates || isLoadingLgas ? (
          <div className="flex items-center gap-2">
            <Loader /> <span>Submitting...</span>
          </div>
        ) : (
          "Next"
        )}
      </Button>
    </Form>
  );
}

export default PersonalInfo;
