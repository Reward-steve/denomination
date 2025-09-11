import { FaCamera, FaPlus } from "react-icons/fa";
import { uploadImage } from "../../../utils/appHelpers";
import type { ImageUploaderProps } from "../../../types/auth.types";

export default function ImageUploader({
  message,
  imagePreview,
  setImagePreview,
  setImageFile,
  error,
}: ImageUploaderProps) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Upload Label */}
      <label
        htmlFor="image-upload"
        className="relative w-20 h-20 rounded-full border-2 border-border shadow-sm cursor-pointer group"
      >
        {/* Hidden Input */}
        <input
          id="image-upload"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/gif"
          onChange={(e) => uploadImage(e, setImagePreview, setImageFile)}
          className="hidden"
        />

        {/* Image Preview or Placeholder */}
        <div className="w-full h-full overflow-hidden rounded-full bg-transparent">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-dashboard">
              <FaCamera className="text-subText text-2xl" />
            </div>
          )}
        </div>

        {/* Plus Icon */}
        <div className="absolute bottom-[-1px] right-[-2px] w-6 h-6 rounded-full bg-accent border-2 border-white flex items-center justify-center shadow hover:bg-[#10B981]/80 transition-colors duration-200">
          <FaPlus className="text-white text-xs" />
        </div>
      </label>

      {/* Label */}
      <p className="mt-3 text-sm font-medium text-text">{message}</p>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
