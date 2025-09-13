import { toast } from "react-toastify";
import SimpleCrypto from "simple-crypto-js";

/**
 * Handle image upload from input
 * - Validates size & type
 * - Generates preview URL
 * - Stores the File object
 */
export const uploadImage = (
  e: React.ChangeEvent<HTMLInputElement>,
  setImagePreview: (url: string) => void,
  setImageFile: (file: File) => void
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Limit: 2MB
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    toast.error("Image must be smaller than 2MB");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Only JPEG, PNG, JPG, or GIF files are allowed");
    return;
  }

  setImagePreview(URL.createObjectURL(file));
  setImageFile(file);
};

/** Convert File → Base64 string */
export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
  });

/** Basic password strength checker */
export function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return "Weak";
  if (score === 2) return "Medium";
  return "Strong";
}

/**
 * Save encrypted value in session/local storage
 */
export const saveInStore = (
  key: string,
  data: object | string | number | boolean,
  storage: "session" | "local" = "session"
) => {
  try {
    const secret = import.meta.env.VITE_SECRET_KEY;
    const simpleCrypto = new SimpleCrypto(secret);
    const payload = simpleCrypto.encrypt(data);

    if (storage === "session") {
      sessionStorage.setItem(key, payload);
    } else {
      localStorage.setItem(key, payload);
    }
  } catch {
    return null;
  }
};

/**
 * Retrieve and decrypt stored value
 */
export const getFromStore = <T>(
  key: string,
  storage: "session" | "local" = "session"
): T | null => {
  try {
    const secret = import.meta.env.VITE_SECRET_KEY;
    const simpleCrypto = new SimpleCrypto(secret);
    const data =
      storage === "session"
        ? sessionStorage.getItem(key)
        : localStorage.getItem(key);

    return data ? (simpleCrypto.decrypt(data) as T) : null;
  } catch {
    return null;
  }
};

/** Format date string into yyyy-mm-dd or dd-mm-yyyy */
export function formatDate(
  dateString: string,
  format: "yyyy-mm-dd" | "dd-mm-yyyy"
) {
  const [year, month, day] = dateString.split("-");
  return format === "yyyy-mm-dd"
    ? `${year}-${month}-${day}`
    : `${day}-${month}-${year}`;
}

/**
 * Recursively build FormData from objects
 * - Handles nested objects, arrays, Files, Dates, and booleans
 */
export const buildFormData = (
  formData: FormData,
  data: any,
  parentKey?: string
): void => {
  if (data === null || data === undefined || data === "") return;

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const key = parentKey ? `${parentKey}[${index}]` : `${index}`;
      buildFormData(formData, item, key);
    });
    return;
  }

  if (
    typeof data === "object" &&
    !(data instanceof File) &&
    !(data instanceof Date)
  ) {
    Object.entries(data).forEach(([key, value]) => {
      const formKey = parentKey ? `${parentKey}[${key}]` : key;
      buildFormData(formData, value, formKey);
    });
    return;
  }

  if (!parentKey) return;

  if (typeof data === "boolean") {
    formData.append(parentKey, data ? "true" : "false");
  } else if (data instanceof File) {
    formData.append(parentKey, data);
  } else if (data instanceof Date) {
    formData.append(parentKey, data.toISOString());
  } else {
    formData.append(parentKey, String(data));
  }
};
