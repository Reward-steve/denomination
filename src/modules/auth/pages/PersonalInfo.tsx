import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import type { PersonalInfoFormData } from "../../../types/auth.types";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../../hooks/useReg";
import { toast } from "react-toastify";
import { createUCCAUser } from "../services/auth";
import { formatDate, saveInStore } from "../../../utils/appHelpers";
import Form from "../../../components/layout/Form";
import ImageUploader from "../components/ImageUploader";
import FormInput from "../../../components/ui/FormInput";
import {
  FaCalendar,
  FaGlobe,
  FaHeart,
  FaLock,
  FaMapPin,
  FaPhone,
  FaUser,
} from "react-icons/fa6";
import { GoMail } from "react-icons/go";
import { Dropdown } from "../../../components/ui/Dropdown";
import { FaHome } from "react-icons/fa";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
// gender: genderOptions.find((opt) => opt.id === data.gender) || null,
//     marital_status:
//       maritalStatusOptions.find((opt) => opt.id === data.marital_status) ||
//

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

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>();
  const password = watch("bio.password");

  const navigate = useNavigate();
  const { data, setStep, setPrev, updateData } = useRegistration();
  const { email } = data;
  const watchedMaritalStatus = watch("bio.marital_status");
  const watchedGender = watch("bio.gender");
  const watchedPriestStatus = watch("priest_status_id");

  useEffect(() => {
    setStep(1);
    setPrev(false);
  }, [setStep, setPrev]);

  useEffect(() => {
    if (email) setValue("email", email);
  }, [email, setValue]);

  const onSubmit = async (formData: PersonalInfoFormData) => {
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

    try {
      const payload = {
        ...formData,
        bio: {
          ...formData.bio,
          dob: formatDate(formData.bio.dob, "yyyy-mm-dd"), // enforce format
        },
      };

      const res = await createUCCAUser(payload, imageFile!);
      console.log(res.data?.id, res.data);
      if (res.success && res.data) {
        saveInStore("user_id", res.data?.id, "session");
        saveInStore("phone", payload.bio.phone, "session");
        updateData(formData);
        toast.success(res.message);
        navigate("/auth/education-data");
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
    <>
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

        {/* --- */}
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
            <FormInput
              type="date"
              label="Date of Birth"
              placeholder="Select your date of birth"
              error={errors.bio?.dob}
              icon={FaCalendar}
              register={register("bio.dob", {
                required: "Date of Birth is required",
              })}
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
                />
              )}
            />
          </div>
        </div>

        {/* --- */}
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
              error={errors.secondary_phone}
              icon={FaPhone}
              register={register("secondary_phone")}
            />
            <FormInput
              label="Home Address"
              placeholder="Enter Home Address"
              error={errors.residential_address}
              icon={FaHome}
              register={register("residential_address", {
                required: "Home address is required",
              })}
            />
            <FormInput
              type="email"
              label="Email"
              placeholder="your.email@example.com"
              icon={GoMail}
              register={register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              error={errors.email}
            />
          </div>
        </div>

        {/* --- */}
        {/* Geographic Information Section */}
        <div className="space-y-6">
          <div className="font-semibold text-lg text-gray-700">
            Geographic Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Nationality"
              placeholder="Enter Nationality"
              error={errors.nationality}
              icon={FaGlobe}
              register={register("nationality", {
                required: "Nationality is required",
              })}
            />
            <FormInput
              label="Local Govt of Origin"
              placeholder="Enter Local Govt of Origin"
              error={errors.bio?.lga}
              icon={FaMapPin}
              register={register("bio.lga", {
                required: "LGA of origin is required",
              })}
            />
            <FormInput
              label="State of Origin"
              placeholder="Enter State of Origin"
              error={errors.bio?.origin_state}
              icon={FaMapPin}
              register={register("bio.origin_state", {
                required: "State of origin is required",
              })}
            />
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
          </div>
        </div>

        {/* --- */}
        {/* Additional Information Section */}
        <div className="space-y-6">
          <div className="font-semibold text-lg text-gray-700">
            Additional Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="priest_status_id"
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
                />
              )}
            />
            <FormInput
              optional={true}
              label="Hobbies"
              placeholder="Comma separated names of hobbies"
              error={errors.hobbies}
              icon={FaHeart}
              register={register("hobbies")}
            />
          </div>
        </div>

        {/* Account Details Section */}
        <div className="space-y-6">
          <div className="font-semibold text-lg text-gray-700">
            Account Details
          </div>
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
              error={errors.confirm_password}
              icon={FaLock}
              register={register("confirm_password", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
          </div>
        </div>

        {/* --- */}
        <Button
          disabled={isSubmitting}
          textSize="sm"
          type="submit"
          variant="auth"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <Loader /> <span>Submitting...</span>
            </div>
          ) : (
            "Done"
          )}
        </Button>
      </Form>
    </>
  );
}

// Main App component to render the form
export default PersonalInfo;
