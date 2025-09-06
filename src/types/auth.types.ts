// types/auth.types.ts
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import type { IconType } from "react-icons";
import type { Ref } from "react";

/**
 * Bio section — matches screenshot strictly (fields shown in the screenshot are present).
 * Note: `hobbies` in the screenshot is a comma-separated string, so kept as string.
 */
export interface BioData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  password?: string;
  dob: string; // "YYYY-MM-DD"
  gender: string;
  phone: string;
  marital_status: string;
  lga: string;
  city: string;
  bethel: string;
  zone?: string;
  area: string;
  origin_state: string;
  confirm_password: string;
  secondary_phone?: string;
  nationality: string;
  residence_state: string;
  priest_status?: string;
  occupation?: string;
  residential_address?: string;
  email: string;
  previous_pew?: string;
  date_ucca?: string;
  promotion_method?: string;
  inducted?: boolean | string | number;
  induction_date?: string;
  bcs_position?: string;
  hobbies?: string;
}

/**
 * Education object
 */
export interface Education {
  certificate: string;
  study: string;
}

/**
 * Previous position entry
 */
export interface PreviousPosition {
  position_name: string;
  start_year: string;
  end_year: string;
}

/**
 * Next of kin entry (screenshot shows `nok` as an array of these objects)
 */
export interface NextOfKin {
  full_name: string;
  relationship: string;
  phone: string;
  address: string;
}

/**
 * Top-level personal info payload that matches the screenshot exactly.
 * The screenshot top-level keys are: bio, education, prev_positions, nok, user_id, skills
 */
export type PersonalInfoFormData = {
  bio: BioData;
  photo?: File;
  education: Education;
  prev_positions: PreviousPosition[]; // can be []
  nok: NextOfKin[]; // screenshot: array with one object
  user_id?: string | number; // screenshot had "15" as string; support both
  skills: string[]; // array of skill strings
};

/**
 * Small helper to normalize form data into the exact payload shape expected by backend.
 * - Accepts a partial / flat form object and returns a PersonalInfoFormData with:
 *   - bio (merged fields)
 *   - education
 *   - prev_positions (array)
 *   - nok (array)
 *   - skills (array)
 *
 * Usage:
 *   const payload = buildPersonalInfoPayload(formValues);
 *   createUCCAUser(payload);
 */
export function buildPersonalInfoPayload(data: Partial<PersonalInfoFormData>) {
  return {
    user_id: String(data.user_id || ""), // force string
    bio: {
      first_name: data.bio?.first_name || "",
      last_name: data.bio?.last_name || "",
      middle_name: data.bio?.middle_name || "",
      gender: data.bio?.gender || "",
      dob: data.bio?.dob
        ? new Date(data.bio.dob).toISOString().split("T")[0]
        : "",
      phone: String(data.bio?.phone || ""),
      email: data.bio?.email || "",
      marital_status: data.bio?.marital_status || "",
      nationality: data.bio?.nationality || "",
      origin_state: data.bio?.origin_state || "",
      lga: data.bio?.lga || "",
      residence_state: data.bio?.residence_state || "",
      city: data.bio?.city || "",
      residential_address: data.bio?.residential_address || "",
      occupation: data.bio?.occupation || "",
      priest_status: data.bio?.priest_status || "",
      promotion_method: data.bio?.promotion_method || "",
      previous_pew: data.bio?.previous_pew || "",
      hobbies: data.bio?.hobbies || "",
      inducted: data.bio?.inducted || "",
      induction_date: data.bio?.induction_date
        ? new Date(data.bio.induction_date).toISOString().split("T")[0]
        : "",
      date_ucca: data.bio?.date_ucca
        ? new Date(data.bio.date_ucca).toISOString().split("T")[0]
        : "",
      bcs_position: data.bio?.bcs_position || "",
      area: data.bio?.area || "",
      zone: data.bio?.zone || "",
      bethel: data.bio?.bethel || "",
      password: data.bio?.password || "",
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
  };
}

/**
 * Simple helper types used by UI components — left intact from original file.
 */
export interface UserDetails {
  first_name: string;
  last_name: string;
}

export type FormInputProps = {
  maxLength?: number;
  id?: string;
  type?: string;
  label?: string;
  placeholder?: string;
  icon?: IconType;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  styles?: Record<string, string>;
  className?: string;
  ref?: Ref<HTMLInputElement>;
  [key: string]: any;
};

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
