import { apiRequest } from "../../../services/apiResquest";

const buildFormData = (formData: FormData, data: any, parentKey?: string) => {
  if (data && typeof data === "object" && !(data instanceof File)) {
    // If it's a nested object, iterate through its keys
    Object.keys(data).forEach((key) => {
      buildFormData(
        formData,
        data[key],
        parentKey ? `${parentKey}[${key}]` : key
      );
    });
  } else if (Array.isArray(data)) {
    // If it's an array, append each element with the correct array notation
    data.forEach((item, index) => {
      buildFormData(formData, item, `${parentKey}[${index}]`);
    });
  } else {
    // For primitive values or files, append directly
    const value = data == null ? "" : data;
    formData.append(parentKey || "", value);
  }
};

export const createUCCAUser = async (
  payload: any,
  photo?: File
): Promise<{
  success: boolean;
  message: string;
  data: { token: string; id: string } | null;
}> => {
  const formData = new FormData();

  // Use the helper to recursively build FormData from the payload object
  buildFormData(formData, payload);

  // Append the profile photo separately, as it is a File object
  if (photo) {
    formData.append("photo", photo);
  }

  // Make the API request to the specified endpoint
  return await apiRequest("users/create", "POST", formData, "no");
};
export const login = async (
  payload: any
): Promise<{
  success: boolean;
  message: string;
  data: { token: string } | null;
}> => {
  const formData = new FormData();

  // Use the helper to recursively build FormData from the payload object
  buildFormData(formData, payload);

  // Make the API request to the specified endpoint
  return await apiRequest("login", "POST", formData, "no");
};
