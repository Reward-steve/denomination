import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";
import type { IconType } from "react-icons";
import type { Ref } from "react";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  [key: string]: unknown; // For any extra data
}
// Mock types and context to make the file self-contained
export interface RegistrationData {
  email: string;
  username: string;
  reg_status: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone: string;
  gender: string;
  marital_status: string;
  occupation: string;
  residential_address: string;
  hobbies: string;
  secondary_phone?: string;
  nationality?: string;
  priest_status?: string;
}

export interface BioData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  password?: string;
  dob: string;
  gender: string;
  phone: string;
  marital_status: string;
  lga: string;
  city: string;
  bethel: string;
  zone?: string;
  area: string;
  origin_state: string;
  residence_state: string;
}

export interface Education {
  certificate: string;
  study: string;
}

export interface PreviousPosition {
  position_name: string;
  start_year: string;
  end_year: string;
}

export interface NextOfKin {
  full_name: string;
  relationship: string;
  phone: string;
  address: string;
}

export type PersonalInfoFormData = RegistrationData & {
  bio: BioData;
  priest_status_id?: string;
  occupation: string;
  residential_address: string;
  previous_pew?: string;
  date_ucca?: string;
  promotion_method?: string;
  inducted?: boolean;
  induction_date?: string;
  bcs_position?: string;
  hobbies: string;
  education: Education;
  prev_positions: PreviousPosition[];
  nok: NextOfKin[];
  user_id?: number;
  skills: string[];
  confirm_password?: string;
};

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
  icon?: IconType; // from react-icons
  register?: UseFormRegisterReturn;
  error?: FieldError;
  styles?: Record<string, string>; // For custom styles
  className?: string;
  ref?: Ref<HTMLInputElement>;
  [key: string]: any; // For other props like onChange, value, etc
};

export type CodeInputProps = {
  digits: string[];
  refs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onChange: (val: string, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
};
