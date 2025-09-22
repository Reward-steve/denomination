import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import FormInput from "../../../components/ui/FormInput";
import { Dropdown } from "../../../components/ui/Dropdown";
import Modal from "./Modal";
import { useMedia } from "../hook/useMedia";

// Icons
import { FaFileAlt, FaMusic, FaBible } from "react-icons/fa";
import { toast } from "react-toastify";

interface UploadModalProps {
  type: "document" | "song" | "sermon";
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  descr?: string;
  visibility: "public" | "private" | "admins";
}

const VISIBILITY_OPTIONS = [
  { id: "public", name: "Public" },
  { id: "private", name: "Private" },
  { id: "admins", name: "Admins" },
];

// ✅ dynamic metadata per type (with toast messages)
const TYPE_CONFIG = {
  document: {
    title: "Upload Document",
    namePlaceholder: "Enter document name",
    accept: ".pdf,.doc,.docx,.txt",
    icon: <FaFileAlt className="text-blue-500 text-4xl" />,
    dropText: "Click to choose or drag & drop documents",
    accent: "border-blue-300 hover:border-blue-500",
    successMsg: "Document uploaded successfully 📄",
    errorMsg: "Failed to upload document ❌",
  },
  song: {
    title: "Upload Song",
    namePlaceholder: "Enter song title",
    accept: ".mp3,.m4a,.aac",
    icon: <FaMusic className="text-green-500 text-4xl" />,
    dropText: "Click to choose or drag & drop audio files",
    accent: "border-green-300 hover:border-green-500",
    successMsg: "Song uploaded successfully 🎵",
    errorMsg: "Failed to upload song ❌",
  },
  sermon: {
    title: "Upload Sermon",
    namePlaceholder: "Enter sermon title",
    accept: "audio/*,video/*",
    icon: <FaBible className="text-purple-500 text-4xl" />,
    dropText: "Click to choose or drag & drop sermons (audio/video)",
    accent: "border-purple-300 hover:border-purple-500",
    successMsg: "Sermon uploaded successfully ✝️",
    errorMsg: "Failed to upload sermon ❌",
  },
} as const;

export const UploadModal = ({ type, isOpen, onClose }: UploadModalProps) => {
  const { uploadAndCreateDocument, creating, uploading } = useMedia(type);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      descr: "",
      visibility: "public",
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    title,
    namePlaceholder,
    accept,
    icon,
    dropText,
    accent,
    successMsg,
    errorMsg,
  } = TYPE_CONFIG[type];

  const onSubmit = async (data: FormValues) => {
    if (!files.length) {
      setErrorMessage("Please select at least one file.");
      return;
    }

    try {
      setErrorMessage(null);
      await uploadAndCreateDocument({
        files,
        name: data.name,
        descr: data.descr,
        visibility: data.visibility,
      });
      toast.success(successMsg);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(errorMsg);
      setErrorMessage("Upload failed. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-text my-2">
            Select Files
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${accent}`}
          >
            <input
              type="file"
              multiple
              accept={accept}
              className="hidden"
              id="file-upload"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              {icon}
              <span className="text-sm text-text-placeholder">{dropText}</span>
            </label>
            {files.length > 0 && (
              <p className="text-xs text-text-secondary mt-2">
                {files.length} file(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Name */}
        <FormInput
          id="name"
          label="Name"
          placeholder={namePlaceholder}
          register={register("name", { required: "Name is required" })}
          error={errors.name}
        />

        {/* Description */}
        <FormInput
          id="descr"
          label="Description"
          placeholder="Optional description"
          register={register("descr")}
          error={errors.descr}
          optional
        />

        {/* Visibility */}
        <Dropdown
          label="Visibility"
          placeholder="Select visibility"
          items={VISIBILITY_OPTIONS}
          displayValueKey="name"
          value={VISIBILITY_OPTIONS.find((v) => v.id === "public") || null}
          onSelect={(item) =>
            !Array.isArray(item) &&
            setValue("visibility", item?.id as FormValues["visibility"])
          }
        />

        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting || uploading || creating}
          >
            {isSubmitting || uploading || creating ? (
              <div className="flex items-center gap-2">
                <Loader size={16} /> Uploading...
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
