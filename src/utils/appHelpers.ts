import { toast } from "react-toastify";
import SimpleCrypto from "simple-crypto-js";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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

  // Limit: 300KB
  const maxSize = 300 * 1024; // 300KB
  if (file.size > maxSize) {
    toast.error("Photo must be smaller than 300KB");
    return;
  }

  // Allowed formats
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    toast.error("Photo must be an image (jpeg, png, jpg, webp)");
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
    formData.append(parentKey, data ? "1" : "0");
  } else if (data instanceof File) {
    formData.append(parentKey, data);
  } else if (data instanceof Date) {
    formData.append(parentKey, data.toISOString());
  } else {
    formData.append(parentKey, String(data));
  }
};

export function formatDateTime(date: string, time: string) {
  const dt = new Date(`${date}T${time}`);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  // Example output: "Sep 21, 08:00 PM"
  let formatted = dt.toLocaleString("en-US", options);
  // Convert "PM" to "pm" and remove seconds if present
  formatted = formatted
    .replace(", ", ", ")
    .replace(" AM", "am")
    .replace(" PM", "pm");
  return formatted;
}

export function formatNum(number: string | number) {
  let num = +number;
  return num < 10 ? "0" + num : num;
}

export const handleDownload = async (paths: Array<string>, name: string) => {
  const zip = new JSZip();
  const server_folder: string =
    import.meta.env.VITE_BASE_URL.split("/api/")[0] ||
    "https://ucca-api.skoolpilot.com.ng";
  // If you want to add a folder
  if (paths.length === 1) {
    saveAs(`${server_folder}/${paths[0]}`, name);
    return;
  } else {
    const imgFolder = zip.folder(name);
    paths.forEach((p) => {
      imgFolder?.file(`${server_folder}/${p}`);
    });
  }
  // Generate the zip
  const content = await zip.generateAsync({ type: "blob" });

  // Trigger download
  saveAs(content, "ucca-files.zip");
};

export function objectToQueryParam<T extends Record<string, any>>(
  obj: T
): string {
  // Filter out properties that are undefined, null, or empty strings.
  const filteredEntries = Object.entries(obj).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ""
  );

  // Map each entry to a URL-encoded key-value pair.
  const queryString = new URLSearchParams(filteredEntries as any).toString();

  return queryString.length > 0 ? "?" + queryString : queryString;
}
