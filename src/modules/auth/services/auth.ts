import type { LoginResponse } from "../../../context/AuthContext";
import { apiRequest } from "../../../services/apiRequest";

// 🔐 Request Code
export const requestCode = async (email: string) =>
  await apiRequest("onboard/request-code", "POST", { email }, "no");

// 🔐 Verify Code
export const verifyCode = async (
  email: string,
  code: string
): Promise<{
  success: boolean;
  message: string;
  data: { school: { reg_status: string }; user: { username: string } } | null;
}> => {
  return await apiRequest("onboard/verify-code", "POST", { email, code }, "no");
};

// 🔑 Create School Owner (with FormData)
export const createSchoolOwner = async (
  email: string,
  last_name: string,
  phone: string,
  gender: string,
  photo: File,
  password: string,
  cpassword: string,
  first_name: string
): Promise<{
  success: boolean;
  message: string;
  data: { token: string } | null;
}> => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("last_name", last_name);
  formData.append("phone", phone);
  formData.append("gender", gender);
  formData.append("password", password);
  formData.append("cpassword", cpassword);
  formData.append("first_name", first_name);

  if (photo) {
    formData.append("photo", photo);
  }

  return await apiRequest("auth/create-school-owner", "POST", formData, "no");
};

// 👤 Complete Profile (FormData upload)
export const completeProfile = async (
  email: string,
  name: string,
  phone: string,
  address: string,
  logo?: File,
  abbr?: string
) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("name", name);
  formData.append("phone", phone);
  formData.append("address", address);

  if (abbr) {
    formData.append("abbr", abbr);
  }
  if (logo) {
    formData.append("logo", logo);
  }
  // ✅ Pass raw FormData
  return await apiRequest("onboard/collect-info", "POST", formData, "no");
};

// 🔐 Login
export const loginSchool = async (
  username: string,
  password: string
): Promise<LoginResponse | undefined> =>
  await apiRequest("login", "POST", { username, password }, "no");

//  🔑 Create Password
export const createPassword = async (
  email: string,
  password: string,
  cpassword: string
) =>
  await apiRequest(
    "auth/create-password",
    "POST",
    {
      email,
      password,
      cpassword,
    },
    "no"
  );

// 🔁 Reset Password
export const resetPassword = async (email: string) =>
  await apiRequest("auth/password-reset", "POST", { email }, "no");
