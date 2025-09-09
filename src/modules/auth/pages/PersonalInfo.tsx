import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  type PersonalInfoFormData,
  type LGA,
  type States,
} from "../../../types/auth.types";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../../hooks/useReg";
import { toast } from "react-toastify";
import Form from "../../../components/layout/Form";
import ImageUploader from "../components/ImageUploader";
import FormInput from "../../../components/ui/FormInput";
import {
  FaHeart,
  FaLock,
  FaMapPin,
  FaPhone,
  FaUser,
  FaVenusMars,
  FaRing,
  FaCross,
} from "react-icons/fa6";
import { GoMail } from "react-icons/go";
import { Dropdown } from "../../../components/ui/Dropdown";
import { FaHome } from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import FormInputDate from "../../../components/ui/FormInputDate";
import { fetchStates, fetchLGA } from "../services/auth";

interface DropdownOption {
  id: string;
  name: string;
}

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

function PersonalInfo() {
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [states, setStates] = useState<States[]>([]);
  const [lgas, setLgas] = useState<LGA[]>([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingLgas, setIsLoadingLgas] = useState(false);
  const [stateError, setStateError] = useState<string | null>(null);
  const [lgaError, setLgaError] = useState<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    setValue,
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
  const watchedMaritalStatus = watch("bio.marital_status");
  const watchedGender = watch("bio.gender");
  const watchedPriestStatus = watch("bio.priest_status");
  const watchedOriginState = watch("bio.origin_state");

  const navigate = useNavigate();
  const { setStep, setPrev, updateData } = useRegistration();

  // Fetch states on mount
  useEffect(() => {
    const loadStates = async () => {
      setIsLoadingStates(true);
      try {
        const res = await fetchStates();
        setStates(res.data!);
      } catch (error) {
        console.error("Error fetching states:", error);
        setStateError("Failed to load states. Please try again.");
        toast.error("Failed to load states.");
      } finally {
        setIsLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  // Fetch LGAs when state is selected
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
          setLgas(res.data!);
          setLgaError(null);
        } else {
          setLgaError(res.message || "Failed to load LGAs");
          toast.error(res.message || "Failed to load LGAs");
        }
      } catch {
        setLgaError("Failed to load LGAs. Please try again.");
        toast.error("Failed to load LGAs");
      } finally {
        setIsLoadingLgas(false);
      }
    };
    loadLgas();
  }, [selectedStateId, setValue]);

  useEffect(() => {
    setStep(1);
    setPrev(false);
  }, [setStep, setPrev]);

  const onSubmit = async (formData: PersonalInfoFormData) => {
    console.log("Form data:", formData);
    if (!watchedGender) {
      toast.error("Please select a Gender.");
      return;
    }
    if (!watchedMaritalStatus) {
      toast.error("Please select a Marital Status.");
      return;
    }
    if (!watchedPriestStatus) {
      toast.error("Please select a Priest Status.");
      return;
    }
    if (!watchedOriginState) {
      toast.error("Please select a State of Origin.");
      return;
    }

    try {
      const payload = { ...formData, photo: imageFile! };
      updateData(payload);
      toast.success("Personal information saved!");
      navigate("/auth/education-data");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  return (
    <Form
      title="UCCA Personal Information"
      description="Please provide your personal details as required for UCCA registration. Ensure all information is accurate and up to date."
      onSubmit={handleSubmit(onSubmit)}
    >
      <ImageUploader
        message="Add profile photo"
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        setImageFile={setImageFile}
      />

      {/* Basic Details Section */}
      <div className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-700">Basic Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="First Name"
            placeholder="Enter first name"
            error={errors.bio?.first_name}
            icon={FaUser}
            register={register("bio.first_name", {
              required: "First name is required",
            })}
          />
          <FormInput
            optional={true}
            label="Middle Name"
            placeholder="Enter middle name"
            error={errors.bio?.middle_name}
            icon={FaUser}
            register={register("bio.middle_name")}
          />
          <FormInput
            label="Last Name"
            placeholder="Enter last name"
            error={errors.bio?.last_name}
            icon={FaUser}
            register={register("bio.last_name", {
              required: "Last name is required",
            })}
          />
          <FormInputDate
            control={control}
            name="bio.dob"
            label="Date of Birth"
            error={errors.bio?.dob}
          />
          <Controller
            name="bio.gender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                isError={!!error}
                label="Gender"
                placeholder="Select Gender"
                items={genderOptions}
                displayValueKey="name"
                size="big"
                errorMsg={error?.message}
                onSelect={(item) => field.onChange(item.id)}
                value={field.value}
                icon={FaVenusMars}
              />
            )}
          />
          <Controller
            name="bio.marital_status"
            control={control}
            rules={{ required: "Marital status is required" }}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                isError={!!error}
                label="Marital Status"
                placeholder="Select Marital Status"
                items={maritalStatusOptions}
                displayValueKey="name"
                size="big"
                errorMsg={error?.message}
                onSelect={(item) => field.onChange(item.id)}
                value={field.value}
                icon={FaRing}
              />
            )}
          />
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-700">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Mobile Number"
            placeholder="Primary mobile number"
            error={errors.bio?.phone}
            icon={FaPhone}
            register={register("bio.phone", {
              required: "Mobile number is required",
              pattern: { value: /^\d+$/, message: "Invalid phone number" },
            })}
          />
          <FormInput
            optional={true}
            label="Secondary Mobile Number"
            placeholder="Secondary mobile number"
            error={errors?.bio?.secondary_phone}
            icon={FaPhone}
            register={register("bio.secondary_phone")}
          />
          <FormInput
            label="Home Address"
            placeholder="Enter Home Address"
            error={errors?.bio?.residential_address}
            icon={FaHome}
            register={register("bio.residential_address", {
              required: "Home address is required",
            })}
          />
          <FormInput
            type="email"
            label="Email"
            placeholder="youremail@example.com"
            icon={GoMail}
            register={register("bio.email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email",
              },
            })}
            error={errors?.bio?.email}
          />
        </div>
      </div>

      {/* Geographic Information Section */}
      <div className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-700">
          Geographic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <FormInput
            label="City of Residence"
            placeholder="Enter City of Residence"
            error={errors.bio?.city}
            icon={FaMapPin}
            register={register("bio.city", {
              required: "City of residence is required",
            })}
          />
          <FormInput
            label="Nationality"
            error={errors.bio?.nationality}
            disabled={true}
            icon={FaMapPin}
            value={"Nigeria"}
            register={register("bio.nationality", {
              required: "Nationality is required",
            })}
          />
          <FormInput
            label="State of Residence"
            placeholder="Enter State of Residence"
            error={errors.bio?.residence_state}
            icon={FaMapPin}
            register={register("bio.residence_state", {
              required: "State of residence is required",
            })}
          />
          <FormInput
            label="Area of Residence"
            placeholder="Enter Area of Residence"
            error={errors.bio?.area}
            icon={FaMapPin}
            register={register("bio.area", {
              required: "Area of residence is required",
            })}
          />
          <FormInput
            label="Bethel of Residence"
            placeholder="Enter Bethel of Residence"
            error={errors.bio?.bethel}
            icon={FaHome}
            register={register("bio.bethel", {
              required: "Bethel of residence is required",
            })}
          />
          <FormInput
            optional={true}
            label="Zone of Residence"
            placeholder="Enter Zone of Residence"
            error={errors.bio?.zone}
            icon={FaMapPin}
            register={register("bio.zone")}
          />
          {/* Right Column */}
          <Controller
            name="bio.origin_state"
            control={control}
            rules={{ required: "State of origin is required" }}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                isError={!!error || !!stateError}
                label="State of Origin"
                placeholder="Select State of Origin"
                items={states}
                displayValueKey="name"
                size="big"
                errorMsg={`${error?.message || stateError}`}
                onSelect={(item) => {
                  field.onChange(item.name.toString());
                  setSelectedStateId(item.id.toString());
                  setValue("bio.lga", "");
                }}
                value={field.value}
                icon={FaMapPin}
                loading={isLoadingStates}
                disabled={isLoadingStates || !!stateError}
              />
            )}
          />
          <Controller
            name="bio.lga"
            control={control}
            rules={{
              required: "LGA of origin is required",
              validate: (value) => !!value || "Please select an LGA",
            }}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                isError={!!error || !!lgaError}
                label="Local Govt of Origin"
                placeholder="Select LGA of Origin"
                items={lgas}
                displayValueKey="name"
                size="big"
                errorMsg={`${error?.message || lgaError}`}
                onSelect={(item) => field.onChange(item.name.toString())}
                value={field.value}
                icon={FaMapPin}
                loading={isLoadingLgas}
                disabled={
                  isLoadingLgas || !selectedStateId || lgas.length === 0
                }
              />
            )}
          />
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-700">
          Additional Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="bio.priest_status"
            control={control}
            rules={{ required: "Priest status is required" }}
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                isError={!!error}
                label="Priest Status"
                placeholder="Select Priest Status"
                items={priestStatusOptions}
                displayValueKey="name"
                size="big"
                errorMsg={error?.message}
                onSelect={(item) => field.onChange(item.id)}
                value={field.value}
                icon={FaCross}
              />
            )}
          />
          <FormInput
            optional={true}
            label="Hobbies"
            placeholder="Comma separated names of hobbies"
            error={errors?.bio?.hobbies}
            icon={FaHeart}
            register={register("bio.hobbies")}
          />
        </div>
      </div>

      {/* Account Details Section */}
      <div className="space-y-6">
        <h2 className="font-semibold text-lg text-gray-700">Account Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            error={errors.bio?.password}
            icon={FaLock}
            register={register("bio.password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
          />
          <FormInput
            label="Confirm Password"
            placeholder="Confirm your password"
            type="password"
            error={errors?.bio?.confirm_password}
            icon={FaLock}
            register={register("bio.confirm_password", {
              required: "Confirm password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
        </div>
      </div>

      <Button
        disabled={isSubmitting || isLoadingStates || isLoadingLgas}
        textSize="sm"
        type="submit"
        variant="auth"
      >
        {isSubmitting || isLoadingStates || isLoadingLgas ? (
          <div className="flex items-center space-x-2">
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
