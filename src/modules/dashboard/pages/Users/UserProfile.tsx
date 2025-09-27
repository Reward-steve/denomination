// src/features/dashboard/pages/UserProfile.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 🚨 NEW IMPORT: React Hook Form
import { useForm, type SubmitHandler } from "react-hook-form";
import DashboardLayout from "../../components/Layout";
import { fetchUserById } from "./services";
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
  MdOutlineCloudUpload, // Keeping the nice icon from the previous response
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

import type { PersonalInfoFormData, User } from "../../../../types/auth.types";
import { useAuth } from "../../../../hooks/useAuth";
import FormInput from "../../../../components/ui/FormInput";
import { createUCCAUser } from "../../../auth/services/auth";

// -----------------------------------------------------------
// 🔹 Utility: Get user photo safely
// -----------------------------------------------------------
const getUserPhotoUrl = (photoPath: string | undefined | null) => {
  if (!photoPath) return defaultAvatar;
  const baseUrl = import.meta.env.VITE_BASE_URL.split("/api/")[0];
  return `${baseUrl}/${photoPath}`;
};

// -----------------------------------------------------------
// ⚛️ TYPES for RHF
// -----------------------------------------------------------
type UserFormFields = {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string; // Disabled
  primary_phone: string; // Disabled
  secondary_phone: string;
  dob: string;
  gender: string;
  occupation: string;
  residential_address: string;
};

// -----------------------------------------------------------
// 🚀 MAIN COMPONENT: UserProfile (View/Edit Toggler)
// -----------------------------------------------------------
export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth(); // logged-in user
  console.log(authUser);

  const [profileUser, setProfileUser] = useState<User | null>(null); // 👈 renamed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Compare logged-in user vs profile
  const isOwner = useMemo(
    () =>
      authUser && profileUser && String(authUser.id) === String(profileUser.id),
    [authUser, profileUser]
  );

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { data },
      } = await fetchUserById(userId!);
      if (data) setProfileUser(data);
      else setError("User not found 😔");
    } catch (err) {
      console.error(err);
      setError("Unable to load profile. Try again later.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) loadUser();
  }, [userId, loadUser]);

  const fullName = useMemo(
    () =>
      profileUser
        ? `${profileUser.first_name} ${profileUser.middle_name || ""} ${
            profileUser.last_name
          }`
        : "",
    [profileUser]
  );

  const handleSave = (updatedUser: User) => {
    setIsEditing(false);
    setProfileUser(updatedUser); // 👈 update profileUser, not auth user
  };

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

  if (!isEditing) {
    return (
      <DashboardLayout>
        <DashboardHeader
          title={`${profileUser.first_name}'s Profile`}
          description={`Detailed information about ${fullName}`}
        >
          <UserProfileView
            user={profileUser}
            fullName={fullName}
            navigate={navigate}
            onEdit={() => setIsEditing(true)}
            isOwner={isOwner!} // clean prop
          />
        </DashboardHeader>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader
        title={`Editing ${profileUser.first_name}'s Profile`}
        description={`Modify details for ${fullName}`}
      >
        <UserProfileEdit
          user={profileUser}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
        />
      </DashboardHeader>
    </DashboardLayout>
  );
}

// -----------------------------------------------------------
// ✨ Component: UserProfileView (The beautiful display mode)
// -----------------------------------------------------------

interface UserProfileViewProps {
  user: User;
  fullName: string;
  navigate: ReturnType<typeof useNavigate>;
  onEdit: () => void;
  isOwner: boolean; // 3. Added isOwner prop
}

function UserProfileView({
  user,
  fullName,
  navigate,
  onEdit,
  isOwner, // Destructure isOwner
}: UserProfileViewProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 bg-surface rounded-3xl shadow-lg border border-border space-y-10">
      {/* 🔹 Profile Overview */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-8 border-b border-border">
        <img
          src={getUserPhotoUrl(user.photo)}
          alt={user.first_name}
          className="w-36 h-36 rounded-full object-cover shadow-md border-4 border-primary/30 hover:scale-105 transition-transform"
        />
        <div className="flex flex-col text-center md:text-left flex-1">
          <h2 className="text-3xl font-extrabold text-text">{fullName}</h2>
          <p className="text-lg font-medium text-primary mt-1">
            {user.occupation || "UCCA Member"}
          </p>
          <p className="flex items-center justify-center md:justify-start text-text-secondary mt-2">
            <FaMapMarkerAlt className="mr-2 text-sm" />
            {user.city || "Unknown City"},{" "}
            {user.residence_state || "Unknown State"}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center md:justify-end">
          {isOwner && ( // 4. Conditionally render Edit Button
            <Button
              onClick={onEdit}
              className="bg-success hover:bg-success/90 text-white shadow-md transition-all duration-300"
            >
              <MdEdit className="mr-2" /> Edit Profile
            </Button>
          )}
          <Button variant="outline" onClick={() => navigate(-1)}>
            <MdArrowBack className="mr-2" /> Back
          </Button>
        </div>
      </div>

      {/* 🔹 Details Grid (VIEW MODE) - Remains the same */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left (Main info) */}
        <div className="lg:col-span-2 space-y-8">
          <Section
            title="Personal Details"
            icon={<FaHeart className="text-primary" />}
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
            />
          </Section>

          <Section
            title="Community Affiliation"
            icon={<FaHandsHelping className="text-success" />}
          >
            <GridInfo
              items={[
                { label: "Bethel", value: user.bethel },
                { label: "Zone", value: user.zone },
                { label: "Area", value: user.area },
                { label: "Priest Status", value: user.priest_status },
                { label: "Previous Pew", value: user.previous_pew },
                { label: "Joined UCCA", value: user.date_ucca },
                {
                  label: "Promotion Method",
                  value: user.promotion_method,
                  fullRow: true,
                },
              ]}
            />
          </Section>
        </div>

        {/* Right (Sidebar info) */}
        <div className="lg:col-span-1 space-y-8">
          <Section
            title="Contact"
            icon={<MdOutlineMessage className="text-info" />}
          >
            <GridInfo
              items={[
                { label: "Phone", value: user.primary_phone, copyable: true },
                user.secondary_phone
                  ? {
                      label: "Alt Phone",
                      value: user.secondary_phone,
                      copyable: true,
                    }
                  : false,

                { label: "Email", value: user.email, copyable: true },
              ]}
              cols={1}
            />
          </Section>

          {user.skills?.length > 0 && (
            <Section
              title="Skills"
              icon={<FaBriefcase className="text-warning" />}
            >
              <div className="flex flex-wrap gap-2">
                {user.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary font-medium"
                  >
                    {s.skill_name}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------
// ✏️ Component: UserProfileEdit (RHF - Optimized)
// -----------------------------------------------------------

function UserProfileEdit({
  user,
  onCancel,
  onSave,
  isSaving,
  setIsSaving,
}: any) {
  const { register, handleSubmit, reset } = useForm<UserFormFields>({
    defaultValues: {
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      email: user.email,
      primary_phone: user.primary_phone,
      secondary_phone: user.secondary_phone || "",
      dob: user.dob || "",
      gender: user.gender || "",
      occupation: user.occupation || "",
      residential_address: user.residential_address || "",
    },
  });

  const [photo, setPhoto] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const onSubmit: SubmitHandler<UserFormFields> = async (data) => {
    setIsSaving(true);
    try {
      // 🚀 Build the full PersonalInfoFormData payload
      const payload: PersonalInfoFormData = {
        bio: {
          first_name: data.first_name,
          middle_name: data.middle_name,
          last_name: data.last_name,
          email: user.email, // locked
          phone: user.primary_phone, // locked
          dob: data.dob,
          gender: data.gender,
          occupation: data.occupation,
          residential_address: data.residential_address,
          // Preserve non-editable values so backend doesn't overwrite them
          marital_status: user.marital_status,
          lga: user.lga,
          city: user.city,
          bethel: user.bethel,
          zone: user.zone,
          area: user.area,
          origin_state: user.origin_state,
          residence_state: user.residence_state,
          priest_status: user.priest_status,
          previous_pew: user.previous_pew,
          date_ucca: user.date_ucca,
          promotion_method: user.promotion_method,
          promotion_letter: user.promotion_letter,
          inducted: user.inducted,
          induction_date: user.induction_date,
          bcs_position: user.bcs_position,
          hobbies: user.hobbies,
        },
        education: user.education || { certificate: "", study: "" },
        prev_positions: user.prev_positions || [],
        nok: user.nok || [],
        skills: user.skills?.map((s: any) => s.skill_name) || [],
        ucca_position: user.ucca_position || [],
        user_id: user.id, // important for update
        photo: photo || undefined,
      };

      const { data: updatedUser } = await createUCCAUser(payload);

      onSave(updatedUser.data); // Update parent state
      reset(); // reset form to updated values
    } catch (err) {
      console.error("Save failed:", err);
      alert("Something went wrong saving your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 bg-surface rounded-3xl shadow-xl border-2 border-primary/50 space-y-8">
      <h3 className="text-2xl font-bold flex items-center text-primary">
        <FaUserCog className="mr-3" /> Edit Mode: Profile Owner Access
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-6 pb-4 border-b border-border">
          <img
            src={
              photo ? URL.createObjectURL(photo) : getUserPhotoUrl(user.photo)
            }
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-primary/40"
          />
          <label className="block cursor-pointer">
            <span className="text-sm font-semibold text-text-secondary flex items-center mb-1">
              <MdOutlineCloudUpload className="mr-2 text-lg text-primary" />
              Update Photo
            </span>
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInput label="First Name" {...register("first_name")} />
          <FormInput label="Middle Name" {...register("middle_name")} />
          <FormInput label="Last Name" {...register("last_name")} />

          <FormInput
            label="Email"
            disabled
            {...register("email")}
            placeholder="Locked by Admin"
          />
          <FormInput
            label="Primary Phone"
            disabled
            {...register("primary_phone")}
            placeholder="Locked by Admin"
          />
          <FormInput label="Alt Phone" {...register("secondary_phone")} />

          <FormInput type="date" label="Date of Birth" {...register("dob")} />
          <FormInput label="Gender" {...register("gender")} />
          <FormInput label="Occupation" {...register("occupation")} />
        </div>

        {/* Full-width field */}
        <FormInput
          label="Residential Address"
          {...register("residential_address")}
        />

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
            className="border-danger text-danger hover:bg-danger/10"
          >
            <MdClose className="mr-2" /> Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-white hover:bg-primary/90"
          >
            {isSaving ? (
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
    </div>
  );
}

/* ---------------------------------------
 * REUSABLE COMPONENTS (Kept the same)
 * ---------------------------------------
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

function GridInfo({
  items,
  cols = 2,
}: {
  items: (GridInfoItem | false)[];
  cols?: number;
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
          <span className="text-xs uppercase text-text-secondary">
            {item.label}
          </span>
          <p
            className={`text-base font-medium text-text ${
              item.copyable ? "cursor-pointer hover:text-primary" : ""
            }`}
            onClick={
              item.copyable
                ? () => navigator.clipboard.writeText(item.value!)
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
