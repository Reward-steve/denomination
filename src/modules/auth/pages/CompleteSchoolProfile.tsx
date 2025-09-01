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
import { completeProfile } from "../services/auth";
import { Loader } from "../../../components/ui/loader";
import { getFromStore } from "../../../utils/appHelpers";

export default function CompleteSchoolProfile() {
  const { setStep, setPrev, updateData, data } = useRegistration();
  const { email, username, reg_status, phone } = data;
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationData>();

  useEffect(() => {
    setStep(4);
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

    if (!phone) {
      const storedPhone = getFromStore("phone");
      if (typeof storedPhone === "string" && storedPhone) {
        updateData({ phone: storedPhone });
      }
    }
    if (!email) {
      const storedEmail = getFromStore("idx");
      if (typeof storedEmail === "string" && storedEmail) {
        updateData({ email: storedEmail });
      }
    }
  }, [
    username,
    reg_status,
    phone,
    email,
    setStep,
    setPrev,
    updateData,
    navigate,
  ]);

  const onSubmit = async (data: RegistrationData) => {
    const { name, address } = data;
    console.log(phone);
    try {
      const res = await completeProfile(
        email,
        name,
        phone,
        address,
        imageFile!
      );

      if (!res.success) {
        toast.error(res.message);
        return;
      }
      console.log(res);
      updateData(data);
      toast.success(res.message);
      navigate("/auth/setup-class");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Form
        title="Complete School Profile"
        description="Let's setup your school's information"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ImageUploader
          message="Upload Profile Picture"
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setImageFile={setImageFile}
        />

        <div className="sm:flex sm:gap-2 space-y-4 sm:space-y-0">
          <div>
            <FormInput
              label="School Name"
              placeholder="Enter school name"
              error={errors.name}
              register={register("name", {
                required: "School name is required",
              })}
            />
          </div>

          <div>
            <FormInput
              label="Abbreviation"
              placeholder="Enter School abbr"
              error={errors.abbr}
              register={register("abbr", {
                required: "Abbreviation is required",
              })}
            />
          </div>
        </div>

        <div>
          <FormInput
            label="Address"
            placeholder="Enter school address"
            error={errors.address}
            register={register("address", { required: "Address is required" })}
          />
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
