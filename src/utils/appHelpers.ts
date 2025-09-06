import { toast } from "react-toastify";
import SimpleCrypto from "simple-crypto-js";

export const uploadImage = (
  e: React.ChangeEvent<HTMLInputElement>,
  setImagePreview: (url: string) => void,
  setImageFile: (file: File) => void
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    toast.error("Image must be smaller than 2MB");
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Only JPEG, PNG, JPG, or GIF files are allowed");
    return;
  }

  // Generate preview URL
  const previewUrl = URL.createObjectURL(file);
  setImagePreview(previewUrl);

  // Store the actual File object
  setImageFile(file);
};

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

// === Storage Functions (Session/Local) ===
export const saveInStore = (
  key: string,
  data: object | string | number | boolean,
  storage: "session" | "local" = "session"
) => {
  try {
    const _secret = import.meta.env.VITE_SECRET_KEY;
    const simpleCrypto = new SimpleCrypto(_secret);
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

export const getFromStore = <T>(
  key: string,
  storage: "session" | "local" = "session"
): T | null => {
  try {
    const _secret = import.meta.env.VITE_SECRET_KEY;
    const simpleCrypto = new SimpleCrypto(_secret);
    const data =
      storage === "session"
        ? sessionStorage.getItem(key)
        : localStorage.getItem(key);

    return data ? (simpleCrypto.decrypt(data) as T) : null;
  } catch {
    return null;
  }
};

export function formatDate(
  dateString: string,
  format: "yyyy-mm-dd" | "dd-mm-yyyy"
) {
  const [year, month, day] = dateString.split("-");
  return format === "yyyy-mm-dd"
    ? `${year}-${month}-${day}`
    : `${day}-${month}-${year}`;
}
