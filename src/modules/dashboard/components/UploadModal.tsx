import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import FormInput from "../../../components/ui/FormInput";
import { Dropdown } from "../../../components/ui/Dropdown";
import Modal from "./Modal";
import { useMedia } from "../hook/useMedia";
import { toast } from "react-toastify";

// Icons
import { FaFileAlt, FaMusic, FaBible, FaTrash } from "react-icons/fa";

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

const TYPE_CONFIG = {
  document: {
    title: "Upload Document",
    namePlaceholder: "Enter document name",
    accept: ".pdf,.doc,.docx,.txt",
    icon: <FaFileAlt className="text-blue-500 text-4xl" />,
    dropText: "Click or drag & drop documents",
    accent: "border-blue-300 hover:border-blue-500",
    successMsg: "Document uploaded successfully 📄",
    errorMsg: "Failed to upload document ❌",
  },
  song: {
    title: "Upload Song",
    namePlaceholder: "Enter song title",
    accept: ".mp3,.m4a,.aac",
    icon: <FaMusic className="text-green-500 text-4xl" />,
    dropText: "Click or drag & drop audio files",
    accent: "border-green-300 hover:border-green-500",
    successMsg: "Song uploaded successfully 🎵",
    errorMsg: "Failed to upload song ❌",
  },
  sermon: {
    title: "Upload Sermon",
    namePlaceholder: "Enter sermon title",
    accept: "audio/*,video/*",
    icon: <FaBible className="text-purple-500 text-4xl" />,
    dropText: "Click or drag & drop sermons",
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
    defaultValues: { name: "", descr: "", visibility: "public" },
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

  // --- File handlers ---
  const handleFiles = useCallback((selected: FileList | null) => {
    if (!selected) return;
    setFiles(Array.from(selected));
    setErrorMessage(null);
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- Submit handler ---
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      footer={
        <div className="flex items-center justify-center flex-col sm:flex-row w-full gap-3">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            form="upload-form"
            className="w-full"
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
      }
    >
      <form
        id="upload-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium mb-2 text-text">
            Select Files
          </label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${accent}`}
          >
            <input
              type="file"
              multiple
              accept={accept}
              id="file-upload"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              {icon}
              <span className="text-sm text-text-placeholder">{dropText}</span>
            </label>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm text-text-secondary">
              {files.map((file, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center px-3 py-2 rounded bg-db-surface/60"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(i)}
                    className="ml-3 p-1 rounded hover:bg-red-100"
                  >
                    <FaTrash className="text-red-500 w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
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
      </form>
    </Modal>
  );
};
