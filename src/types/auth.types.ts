import { type FieldError, type UseFormRegisterReturn } from "react-hook-form";
import type { IconType } from "react-icons";
import type { Ref } from "react";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  [key: string]: unknown; // For any extra data
}
export interface RegistrationData {
  email: string;
  code: string;
  password: string;
  cpassword: string;
  name: string;
  logo?: string;
  school_logo: string;
  phone: string;
  abbr: string;
  address: string;
  last_name: string;
  gender: string;
  passport: string;
  first_name: string;
  username: string;
  reg_status: string;
}

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
