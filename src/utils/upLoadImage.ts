import { toast } from "react-toastify";

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
