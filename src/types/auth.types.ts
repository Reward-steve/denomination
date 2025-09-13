// types/auth.types.ts
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import type { IconType } from "react-icons";
import type { ComponentPropsWithoutRef } from "react";

/* ----------------------------------------
 * Supporting Types
 * --------------------------------------*/
export interface States {
  id: number;
  name: string;
  country_id: string;
}

export interface LGA {
  id: number;
  name: string;
  state_id: number;
}

/* ----------------------------------------
 * Bio section (core personal info)
 * Matches backend payload exactly
 * --------------------------------------*/
export interface BioData {
  first_name: string;
  last_name: string;
  middle_name?: string;
  password?: string;
  confirm_password?: string;

  dob: string; // "YYYY-MM-DD"
  gender: string;
  phone: string;
  secondary_phone?: string;
  email: string;
  marital_status: string;

  origin_state: string;
  residence_state: string;
  lga: string;
  city: string;

  residential_address?: string;
  nationality?: string;
  occupation?: string;
  priest_status?: string;

  promotion_method?: string;
  promotion_letter: File | null;
  previous_pew?: string;

  hobbies?: string;

  inducted?: boolean;
  induction_date?: string; // "YYYY-MM-DD"
  date_ucca?: string; // "YYYY-MM-DD"

  bcs_position?: string;

  // Hierarchy fields
  bethel: string;
  zone?: string;
  area: string;
}

/* ----------------------------------------
 * Education
 * --------------------------------------*/
export interface Education {
  certificate: string;
  study: string;
}

/* ----------------------------------------
 * Previous positions
 * --------------------------------------*/
export interface PreviousPosition {
  position_name: string;
  start_year: string;
  end_year: string;
}

/* ----------------------------------------
 * Next of kin
 * --------------------------------------*/
export interface NextOfKin {
  full_name: string;
  relationship: string;
  phone: string;
  address: string;
}

/* ----------------------------------------
 * Top-level personal info payload
 * This is what backend expects
 * --------------------------------------*/
export type PersonalInfoFormData = {
  bio: BioData;
  education: Education;
  prev_positions: PreviousPosition[];
  nok: NextOfKin[];
  skills: string[];
  ucca_position: number[];
  photo?: File; // optional profile photo upload;
  user_id?: string | number; // only required for update flow
};

export interface Skill {
  id: number;
  user_id: number;
  skill_name: string;
  created_at: string;
  updated_at: string;
}

/* ----------------------------------------
 * Payload builder (frontend → backend)
 * Normalizes partial form data
 * --------------------------------------*/
export function buildPersonalInfoPayload(
  data: Partial<PersonalInfoFormData>
): PersonalInfoFormData {
  return {
    user_id: data.user_id ? String(data.user_id) : undefined,

    bio: {
      first_name: data.bio?.first_name || "",
      last_name: data.bio?.last_name || "",
      middle_name: data.bio?.middle_name || "",
      password: data.bio?.password || "",
      dob: data.bio?.dob
        ? new Date(data.bio.dob).toISOString().split("T")[0]
        : "",
      gender: data.bio?.gender || "",
      phone: String(data.bio?.phone || ""),
      email: data.bio?.email || "",
      marital_status: data.bio?.marital_status || "",
      origin_state: data.bio?.origin_state || "",
      residence_state: data.bio?.residence_state || "",
      lga: data.bio?.lga || "",
      city: data.bio?.city || "",
      residential_address: data.bio?.residential_address || "",
      occupation: data.bio?.occupation || "",
      promotion_letter: data.bio?.promotion_letter || null,
      priest_status: data.bio?.priest_status || "",
      promotion_method: data.bio?.promotion_method || "",
      previous_pew: data.bio?.previous_pew || "",
      hobbies: data.bio?.hobbies || "",
      inducted: data.bio?.inducted ?? false,
      secondary_phone: data.bio?.secondary_phone || "",
      nationality: data.bio?.nationality || "",
      confirm_password: data.bio?.password || "",
      induction_date: data.bio?.induction_date
        ? new Date(data.bio.induction_date).toISOString().split("T")[0]
        : "",
      date_ucca: data.bio?.date_ucca
        ? new Date(data.bio.date_ucca).toISOString().split("T")[0]
        : "",
      bcs_position: data.bio?.bcs_position || "",
      bethel: data.bio?.bethel || "",
      zone: data.bio?.zone || "",
      area: data.bio?.area || "",
    },

    education: {
      certificate: data.education?.certificate || "",
      study: data.education?.study || "",
    },

    prev_positions: (data.prev_positions || []).map((p) => ({
      position_name: p.position_name || "",
      start_year: String(p.start_year || ""),
      end_year: String(p.end_year || ""),
    })),

    nok: (data.nok || []).map((n) => ({
      full_name: n.full_name || "",
      relationship: n.relationship || "",
      phone: n.phone || "",
      address: n.address || "",
    })),

    skills: data.skills || [],
    ucca_position: data.ucca_position || [],
    photo: data.photo || undefined,
  };
}

/* ----------------------------------------
 * Reusable form component props
 * --------------------------------------*/
export type FormInputProps = ComponentPropsWithoutRef<"input"> & {
  label?: string;
  icon?: IconType;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  styles?: Record<string, string>;
  optional?: boolean;
};

export interface ImageUploaderProps {
  message: string;
  imagePreview: string;
  setImagePreview: React.Dispatch<React.SetStateAction<string>>;
  setImageFile: (file: File) => void;
  error?: string; // <-- add this
}

export type CodeInputProps = {
  digits: string[];
  refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onChange: (val: string, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
};

export interface UserDetails {
  first_name: string;
  last_name: string;
}

export interface DropdownOption {
  id: number | string;
  name: string;
}

export interface Position {
  id: number;
  name: string;
  is_enabled: string;
  created_at: string;
  updated_at: string;
  descr: string | null;
}

export interface User {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email_verified_at: string | null;
  reg_status: number;
  dob: string; // ISO date string
  gender: "male" | "female" | string;
  marital_status: "single" | "married" | string;
  lga: string | null;
  city: string | null;
  bethel: string | null;
  zone: string | null;
  area: string | null;
  origin_state: string | null;
  residence_state: string | null;
  nationality: string | null;
  priest_status: string | null;
  occupation: string | null;
  photo: string | null;
  residential_address: string | null;
  hobbies: string | null;
  primary_phone: string;
  secondary_phone: string | null;
  email: string | null;
  previous_pew: string | null;
  date_ucca: string | null;
  promotion_method: string | null;
  inducted: number;
  induction_date: string | null;
  bcs_position: string | null;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
  education: Education | null;
  prev_positions: PreviousPosition[];
  nok: NextOfKin[];
  skills: Skill[];
}
