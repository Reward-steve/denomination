// src/features/dashboard/pages/UserProfile.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import DashboardLayout from "../../components/Layout";
import { fetchUserById, updateProfile, updatePassword } from "./services";
import defaultAvatar from "../../../../assets/images/avater.jpg";
import {
  MdGroupOff,
  MdOutlineWavingHand,
  MdOutlineMessage,
  MdArrowBack,
  MdEdit,
  MdCheck,
  MdClose,
  MdSave,
  MdLock,
} from "react-icons/md";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaHandsHelping,
  FaBriefcase,
  FaUserCog,
} from "react-icons/fa";
import { Button } from "../../../../components/ui/Button";
import { DashboardHeader } from "../../components/Header";
import { useAuth } from "../../../../hooks/useAuth";
import FormInput from "../../../../components/ui/FormInput";
import {
  type PersonalInfoFormData,
  type User,
} from "../../../../types/auth.types";
import { toast } from "react-toastify";
import ImageUploader from "../../../auth/components/ImageUploader";

/* ------------------------------------------
 * Utility: Safe user photo
 * ------------------------------------------ */
/**
 * Constructs the full URL for the user's photo, falling back to a default.
 * @param photoPath The relative path to the user's photo.
 * @returns The full photo URL.
 */
const getUserPhotoUrl = (photoPath?: string | null) => {
  if (!photoPath) return defaultAvatar;
  // Ensure we handle environment variables safely and construct the URL correctly
  const baseUrl = import.meta.env.VITE_BASE_URL?.split("/api/")?.[0] || "";
  return photoPath.startsWith("http") ? photoPath : `${baseUrl}/${photoPath}`;
};

/* ------------------------------------------
 * Types
 * ------------------------------------------ */
interface PasswordFormFields {
  password: string; // Current password
  new_password: string;
  confirm_password: string;
}

/* ------------------------------------------
 * Main Component: UserProfile
 * ------------------------------------------ */
export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Memoize ownership check
  const isOwner = useMemo(
    () =>
      authUser && profileUser && String(authUser.id) === String(profileUser.id),
    [authUser, profileUser]
  );

  // Function to load user data - memoized with useCallback
  const loadUser = useCallback(async () => {
    if (!userId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const {
        data: { data },
      } = await fetchUserById(userId);
      if (data) {
        setProfileUser(data);
      } else {
        setError("User not found 😔");
      }
    } catch (e) {
      console.error("Error loading user profile:", e);
      setError("Unable to load profile. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial data fetch and re-fetch on userId change
  useEffect(() => {
    loadUser();
  }, [loadUser]); // Dependency is loadUser itself

  // Memoize full name calculation
  const fullName = useMemo(
    () =>
      profileUser
        ? `${profileUser.first_name} ${profileUser.middle_name || ""} ${
            profileUser.last_name
          }`.trim()
        : "",
    [profileUser]
  );

  // --- Render Handlers ---

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-72 space-x-3">
          <MdOutlineWavingHand className="text-4xl text-primary animate-pulse" />
          <p className="text-text-secondary">Preparing profile…</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profileUser) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 text-center space-y-4 p-8 bg-surface rounded-2xl shadow-lg m-4">
          <MdGroupOff className="text-7xl text-danger/70" />
          <h2 className="text-xl font-bold text-text">{error}</h2>
          <p className="text-text-placeholder max-w-md">
            This profile may have been archived or the link is incorrect.
          </p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <MdArrowBack className="mr-2" /> Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title={`${profileUser.first_name}'s Profile`}
        description={`Detailed information about ${fullName}`}
      >
        <div className="max-w-6xl mx-auto">
          {isEditing ? (
            <UserProfileEdit
              user={profileUser}
              onCancel={() => {
                setIsEditing(false);
                // Optionally reset the form to initial state on cancel
              }}
              onSuccess={() => {
                setIsEditing(false); // Close edit mode
                loadUser(); // Crucial: reload the updated user data
              }}
            />
          ) : (
            <UserProfileView
              user={profileUser}
              fullName={fullName}
              navigate={navigate}
              onEdit={() => setIsEditing(true)}
              isOwner={!!isOwner}
            />
          )}
        </div>
      </DashboardHeader>
    </DashboardLayout>
  );
}

/* ------------------------------------------
 * View Component
 * ------------------------------------------ */
/**
 * Renders the read-only view of the user's profile.
 */
function UserProfileView({
  user,
  fullName,
  navigate,
  onEdit,
  isOwner,
}: {
  user: User;
  fullName: string;
  navigate: ReturnType<typeof useNavigate>;
  onEdit: () => void;
  isOwner: boolean;
}) {
  const handleCopy = (value: string | null | undefined, label: string) => {
    if (value) {
      navigator.clipboard.writeText(value);
      toast.info(`${label} copied!`);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-background rounded-3xl shadow-xl border border-border space-y-10">
      {/* Overview */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-8 border-b border-border">
        <img
          src={getUserPhotoUrl(user.photo)}
          alt={user.first_name}
          className="w-36 h-36 rounded-full object-cover shadow-md border-4 border-primary/30 hover:scale-105 transition-transform"
        />
        <div className="flex flex-col text-center md:text-left flex-1">
          <h2 className="text-3xl font-extrabold text-text">{fullName}</h2>
          <p className="text-lg font-medium text-accent mt-1">
            {user.occupation || "UCCA Member"}
          </p>
          <p className="flex items-center justify-center md:justify-start text-text-secondary mt-2">
            <FaMapMarkerAlt className="mr-2 text-sm" />
            {user.city || "Unknown City"},{" "}
            {user.residence_state || "Unknown State"}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center md:justify-end">
          {isOwner && (
            <Button onClick={onEdit} variant="primary">
              <MdEdit className="mr-2" /> Edit Profile
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate(-1)}>
            <MdArrowBack className="mr-2" /> Back
          </Button>
        </div>
      </div>

      {/* Details Sections */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left (Main info) */}
        <div className="lg:col-span-2 space-y-8">
          <Section
            title="Personal Details"
            icon={<FaHeart className="text-accent" />}
          >
            <GridInfo
              items={[
                { label: "Gender", value: user.gender },
                { label: "Date of Birth", value: user.dob },
                { label: "Marital Status", value: user.marital_status },
                { label: "Nationality", value: user.nationality },
                { label: "Origin State", value: user.origin_state },
                { label: "Residence State", value: user.residence_state },
                { label: "City", value: user.city },
                {
                  label: "Address",
                  value: user.residential_address,
                  fullRow: true,
                },
              ]}
              handleCopy={handleCopy}
            />
          </Section>

          <Section
            title="Community Affiliation"
            icon={<FaHandsHelping className="text-green-500" />}
          >
            <GridInfo
              items={[
                { label: "Bethel", value: user.bethel },
                { label: "Zone", value: user.zone },
                { label: "Area", value: user.area },
                { label: "Priest Status", value: user.priest_status },
                { label: "Joined UCCA", value: user.date_ucca },
                { label: "Promotion Method", value: user.promotion_method },
                { label: "BCS Position", value: user.bcs_position },
                { label: "Previous Pew", value: user.previous_pew },
                {
                  label: "Inducted",
                  value: user.inducted === 1 ? "Yes" : "No",
                },
                { label: "Induction Date", value: user.induction_date },
                // Use optional chaining for nested objects
                { label: "Education", value: user.education?.certificate },
                { label: "Field of Study", value: user.education?.study },
              ]}
              handleCopy={handleCopy}
            />
          </Section>
        </div>

        {/* Right (Sidebar info) */}
        <div className="lg:col-span-1 space-y-8">
          <Section
            title="Contact"
            icon={<MdOutlineMessage className="text-primary" />}
          >
            <GridInfo
              cols={1}
              items={[
                { label: "Phone", value: user.primary_phone, copyable: true },
                {
                  label: "Alt Phone",
                  value: user.secondary_phone,
                  copyable: true,
                },
                { label: "Email", value: user.email, copyable: true },
              ]}
              handleCopy={handleCopy}
            />
          </Section>

          {user.skills && user.skills.length > 0 && (
            <Section
              title="Skills"
              icon={<FaBriefcase className="text-secondary" />}
            >
              <div className="flex flex-wrap gap-2">
                {user.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 rounded-full text-sm bg-primary/10 text-accent font-medium"
                  >
                    {s.skill_name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {user.nok && user.nok.length > 0 && (
            <Section
              title="Next of Kin (NOK)"
              icon={<FaUserCog className="text-red-500" />}
            >
              {user.nok.map((kin, index) => (
                <div
                  key={index}
                  className="space-y-2 mb-4 p-3 border-b border-border last:border-b-0"
                >
                  <p className="text-base font-bold text-text">
                    {kin.full_name}
                  </p>
                  <GridInfo
                    cols={1}
                    items={[
                      { label: "Relationship", value: kin.relationship },
                      { label: "Phone", value: kin.phone, copyable: true },
                      { label: "Address", value: kin.address, fullRow: true },
                    ]}
                    handleCopy={handleCopy}
                  />
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------
 * Edit Component
 * ------------------------------------------ */
/**
 * Renders the forms for editing profile information and password.
 */
function UserProfileEdit({
  user,
  onCancel,
  onSuccess,
}: {
  user: User;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Initialize form with current user data
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty: isProfileDirty },
  } = useForm<PersonalInfoFormData>({
    defaultValues: {
      bio: {
        first_name: user.first_name,
        middle_name: user.middle_name || "",
        last_name: user.last_name,
        dob: user.dob || "",
        gender: user.gender || "",
        occupation: user.occupation || "",
        residential_address: user.residential_address || "",
      },
      user_id: String(user.id),
    },
  });

  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    watch,
    formState: { errors: errorsPwd, isDirty: isPasswordDirty },
    reset: resetPwd,
  } = useForm<PasswordFormFields>();

  const newPassword = watch("new_password");

  const onSubmitProfile: SubmitHandler<PersonalInfoFormData> = async (data) => {
    setIsSavingProfile(true);
    try {
      let payload: FormData | Omit<PersonalInfoFormData, "photo">;

      if (imageFile) {
        const formData = new FormData();
        formData.append("photo", imageFile);
        formData.append("user_id", String(user.id));
        Object.entries(data.bio).forEach(([key, value]) =>
          formData.append(`bio[${key}]`, value)
        );
        payload = formData;
      } else {
        const { ...rest } = data;
        payload = rest;
      }

      const { data: response } = await updateProfile(payload);

      // Reset form to update isDirty state and call parent success handler
      reset(data, { keepValues: true }); // Keep new values for continuity
      setImageFile(null);
      toast.success(response || "Profile updated successfully! 🎉");
      onSuccess();
    } catch (err: any) {
      console.error("Profile update failed:", err);
      toast.error("Failed to update profile. Try again.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Password Update Handler
  const onSubmitPassword: SubmitHandler<PasswordFormFields> = async (data) => {
    setIsSavingPassword(true);
    try {
      // API expects { user_id, password } for the *new* password
      const payload = { user_id: String(user.id), password: data.new_password };
      await updatePassword(payload);

      toast.success("Password updated successfully! 🔒");
      resetPwd(); // Clear password fields
      // No need to call onSuccess here as it doesn't affect the visible profile data
    } catch (err: any) {
      console.error("Password update failed:", err);
      // Display specific error if available
      toast.error(
        err?.response?.data?.message ||
          "Failed to update password. Check your current password."
      );
    } finally {
      setIsSavingPassword(false);
    }
  };

  const currentPhotoUrl = useMemo(
    () => getUserPhotoUrl(user.photo),
    [user.photo]
  );

  return (
    <div className="bg-background rounded-3xl shadow-xl space-y-8 p-6">
      {/* Profile Information Update Form */}
      <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
        <Section
          title="Profile Information"
          icon={<MdEdit className="text-accent" />}
        >
          <div className="flex items-center space-x-6 pb-4 border-b border-border">
            <Controller
              name="photo"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  message="Change profile picture"
                  imagePreview={
                    imageFile ? URL.createObjectURL(imageFile) : currentPhotoUrl
                  }
                  setImagePreview={() => {
                    /* Not needed here as we use local state or default */
                  }}
                  setImageFile={(file) => {
                    field.onChange(file);
                    setImageFile(file);
                  }}
                  error={undefined} // Error handling for photo is typically simple validation, can be added to state if needed
                />
              )}
            />
            {/* Display current image preview or the newly selected one */}
            <p className="text-sm text-text-secondary">
              Upload a new photo to replace the current one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="First Name"
              {...register("bio.first_name", {
                required: "First name is required",
              })}
            />
            <FormInput label="Middle Name" {...register("bio.middle_name")} />
            <FormInput
              label="Last Name"
              {...register("bio.last_name", {
                required: "Last name is required",
              })}
            />
            {/* Consider making 'gender' a select input for better data quality */}
            <FormInput label="Gender" {...register("bio.gender")} />
            <FormInput
              type="date"
              label="Date of Birth"
              {...register("bio.dob")}
            />
            <FormInput label="Occupation" {...register("bio.occupation")} />
            <div className="md:col-span-2">
              <FormInput
                label="Residential Address"
                {...register("bio.residential_address")}
              />
            </div>
          </div>
        </Section>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSavingProfile}
            className="border-danger text-danger hover:bg-danger/10"
          >
            <MdClose className="mr-2" /> Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSavingProfile || (!isProfileDirty && !imageFile)}
          >
            {isSavingProfile ? (
              <>
                <MdSave className="mr-2 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <MdCheck className="mr-2" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </form>

      <hr className="border-border" />

      {/* Password Update Form */}
      <form onSubmit={handleSubmitPwd(onSubmitPassword)} className="space-y-6">
        <Section title="Security" icon={<MdLock className="text-primary" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput
              label="Current Password"
              type="password"
              {...registerPwd("password", {
                required: "Current password is required",
              })}
              error={errorsPwd.password}
            />
            <FormInput
              label="New Password"
              type="password"
              {...registerPwd("new_password", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              error={errorsPwd.new_password}
            />
            <FormInput
              label="Confirm New Password"
              type="password"
              {...registerPwd("confirm_password", {
                required: "Confirmation is required",
                validate: (val) =>
                  val === newPassword || "Passwords must match",
              })}
              error={errorsPwd.confirm_password}
            />
          </div>
        </Section>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSavingPassword || !isPasswordDirty}
            variant="secondary"
          >
            {isSavingPassword ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ------------------------------------------
 * Reusable Components
 * ------------------------------------------ */
/**
 * A reusable container for a section of content.
 */
function Section({
  title,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center text-lg font-bold text-text border-b border-border pb-1">
        {icon && <span className="mr-2">{icon}</span>} {title}
      </h3>
      <div className="p-4 bg-muted/20 rounded-xl hover:shadow-sm transition">
        {children}
      </div>
    </section>
  );
}

interface GridInfoItem {
  label: string;
  value?: string | null;
  copyable?: boolean;
  fullRow?: boolean;
}

/**
 * Renders a grid of label-value pairs for displaying information.
 */
function GridInfo({
  items,
  cols = 2,
  handleCopy,
}: {
  items: (GridInfoItem | false)[];
  cols?: number;
  handleCopy: (value: string | null | undefined, label: string) => void;
}) {
  const filtered = items.filter((i): i is GridInfoItem => !!i && !!i.value);
  const colClasses = cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1";

  return (
    <div className={`grid gap-4 grid-cols-1 ${colClasses}`}>
      {filtered.map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col ${
            item.fullRow && cols === 2 ? "sm:col-span-2" : ""
          }`}
        >
          <span className="text-xs uppercase text-text-placeholder">
            {item.label}
          </span>
          <p
            className={`text-base font-medium text-text ${
              item.copyable
                ? "cursor-pointer hover:text-primary transition-colors"
                : ""
            }`}
            onClick={
              item.copyable
                ? () => handleCopy(item.value, item.label)
                : undefined
            }
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
