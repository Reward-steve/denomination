import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRegistration } from "../../../hooks/useRegistrationContext";
import Form from "../../../components/layout/Form";
import { Button } from "../../../components/ui/Button";
import ImageUploader from "../components/ImageUploader";
import FormInput from "../../../components/ui/FormInput";
import { type RegistrationData } from "../../../types/auth.types";
import { useNavigate } from "react-router-dom";
import { createSchoolOwner } from "../services/auth";
import { Loader } from "../../../components/ui/loader";
import { getStrength } from "../../../utils/usePwStrengthIndicator";
import { getFromStore, saveInStore } from "../../../utils/appHelpers";
import { Dropdown } from "../../../components/ui/Dropdown";

interface GenderOptions {
  id: string;
  name: string;
}

const genderOptions: GenderOptions[] = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
];
export default function SchoolOwnerInfo() {
  const { setStep, setPrev, updateData, data } = useRegistration();
  const { email, username, reg_status } = data;
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<GenderOptions | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationData>();
  const password = watch("password");

  useEffect(() => {
    setStep(3);
    setPrev(false);
    if (!username || !reg_status) {
      const storedReg = getFromStore("idx_reg") as {
        username?: string;
        reg_status?: string;
      } | null;
      if (storedReg?.username && storedReg?.reg_status) {
        updateData({
          username: storedReg.username,
          reg_status: storedReg.reg_status,
        });
      }
      return;
    }

    if (!email) {
      const storedEmail = getFromStore("idx");
      if (typeof storedEmail === "string" && storedEmail) {
        updateData({ email: storedEmail });
      }
    }
  }, [username, reg_status, email, setStep, setPrev, updateData, navigate]);

  const onSubmit = async (data: RegistrationData) => {
    if (!selectedGender) {
      return;
    }

    const { first_name, last_name, phone, password, cpassword } = data;

    try {
      // ✅ Save phone in sessionStorage immediately
      saveInStore("phone", phone);

      const res = await createSchoolOwner(
        email,
        last_name,
        phone,
        selectedGender?.id,
        imageFile!,
        password,
        cpassword,
        first_name
      );

      const token = res?.data?.token;
      if (token) {
        saveInStore("token", token);
      }

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      updateData(data);
      toast.success(res.message);
      navigate("/auth/complete-profile");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Form
        title="School owner info"
        description="This is expected to be the school owner, as this user will have the same privileges as the school owner"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ImageUploader
          message="Add profile photo"
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setImageFile={setImageFile}
        />

        <div className="sm:flex sm:gap-2 space-y-4 sm:space-y-0">
          <div>
            <FormInput
              label="First Name"
              placeholder="Enter first name"
              error={errors.first_name}
              register={register("first_name", {
                required: "firstname is required",
              })}
            />
          </div>

          <div>
            <FormInput
              label="Last Name"
              placeholder="Enter last name"
              error={errors.last_name}
              register={register("last_name", {
                required: "lastname number is required",
              })}
            />
          </div>
        </div>

        <div className="sm:flex sm:gap-2 space-y-4 sm:space-y-0">
          <div className="sm:w-1/2">
            <FormInput
              label="Phone Number"
              placeholder="Enter phone number"
              error={errors.phone}
              register={register("phone", {
                required: "Phone number is required",
              })}
            />
          </div>

          <div className="sm:w-1/2">
            <Dropdown
              isError={!!errors.gender}
              label="Gender"
              placeholder="Select Gender"
              items={genderOptions} // ✅ always the full array
              displayValueKey="name"
              size="big"
              errorMsg={errors.gender?.message}
              onSelect={(item: GenderOptions) => setSelectedGender(item)} // ✅ store single value
            />
          </div>
        </div>

        <div>
          <FormInput
            label="Username"
            readOnly
            value={username}
            disabled={true}
          />
          <p className="text-subText text-xs mt-2">
            Your username is <strong className="text-text">{username}</strong>.
            Keep it save, you'll use this alongside with your password to login
          </p>
        </div>

        <div className="sm:flex sm:gap-2 space-y-4 sm:space-y-0">
          <div>
            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="********"
              error={errors.password}
              register={register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
            {password && (
              <div className="text-xs mt-1">
                Strength:{" "}
                <span
                  className={
                    getStrength(password) === "Strong"
                      ? "text-green-600"
                      : getStrength(password) === "Medium"
                      ? "text-yellow-600"
                      : "text-error"
                  }
                >
                  {getStrength(password)}
                </span>
              </div>
            )}
          </div>
          <div>
            <FormInput
              id="confirm"
              type="password"
              label="Confirm Password"
              placeholder="********"
              error={errors.cpassword}
              register={register("cpassword", {
                required: "Please confirm your password",
                validate: (val) => val === password || "Passwords do not match",
              })}
            />
          </div>
        </div>

        <Button
          disabled={isSubmitting}
          textSize="sm"
          type="submit"
          variant="auth"
        >
          {isSubmitting ? (
            <>
              <Loader />
            </>
          ) : (
            "Done"
          )}
        </Button>
      </Form>
    </>
  );
}
