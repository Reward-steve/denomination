import { useState } from "react";
import { FaX } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/Button";
import { Loader } from "../../../components/ui/Loader";
import { FileUploadSection } from "./FileUploadSection";
import FormInput from "../../../components/ui/FormInput";
import { Dropdown } from "../../../components/ui/Dropdown";
import type { DocumentFile } from "../types";

interface DocumentUploadModalProps {
  modalRef: React.RefObject<HTMLDivElement | null>;
  closeModal: () => void;
  handleAddFile: (file: DocumentFile) => void;
}

interface DocumentFormValues {
  name: string;
  descr?: string;
  visibility: "public" | "private" | "admins";
  type: "document" | "song" | "sermon";
}

const VISIBILITY_OPTIONS = [
  { id: "public", name: "Public" },
  { id: "private", name: "Private" },
  { id: "admins", name: "Admins" },
];

const TYPE_OPTIONS = [
  { id: "document", name: "Document" },
  { id: "song", name: "Song" },
  { id: "sermon", name: "Sermon" },
];

export const DocumentUploadModal = ({
  modalRef,
  closeModal,
  handleAddFile,
}: DocumentUploadModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
    watch,
  } = useForm<DocumentFormValues>({
    defaultValues: {
      name: "",
      descr: "",
      visibility: "public",
      type: "document",
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedType = watch("type");

  const onSubmit = async (data: DocumentFormValues) => {
    if (!file) {
      setErrorMessage("Please select a file to upload.");
      return;
    }

    try {
      setErrorMessage(null);

      // Step 1: Upload file to storage and get path
      const storagePath = `storage/${data.type}s/${file.name.replace(
        /\s+/g,
        "_"
      )}`;

      // TODO: Replace with actual upload API
      await new Promise((res) => setTimeout(res, 1000));

      // Step 2: Build request body
      const payload = {
        document: [storagePath],
        type: data.type,
        name: data.name,
        descr: data.descr || "",
        visibility: data.visibility,
      };

      console.log("Uploading payload:", payload);

      // TODO: await axios.post("/api/documents", payload);

      // Step 3: Update UI
      const newDoc: DocumentFile = {
        name: data.name,
        size: file.size,
        type: data.type,
        uploadedAt: new Date().toISOString(),
        document: [storagePath],
        visibility: data.visibility,
      };

      handleAddFile(newDoc);
      closeModal();
    } catch (err) {
      console.error(err);
      setErrorMessage("Upload failed. Please try again.");
    }
  };

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`
          bg-surface shadow-xl relative 
          w-full md:w-[500px] max-h-[90vh] overflow-y-auto
          rounded-t-2xl md:rounded-2xl 
          p-4 md:p-6
          animate-slide-up md:animate-fade-in
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between mb-4 border-b border-border pb-3 sticky top-0 bg-surface z-10">
          <h2 className="text-lg sm:text-xl font-semibold">
            Upload {selectedType}
          </h2>
          <button
            onClick={closeModal}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-background/70 transition-colors"
          >
            <FaX size={18} className="text-primary" />
          </button>
        </header>

        {/* Body (Form) */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Type Selection */}
          <Dropdown
            label="Type"
            placeholder="Select type"
            items={TYPE_OPTIONS}
            displayValueKey="name"
            value={TYPE_OPTIONS.find((t) => t.id === selectedType) || null}
            onSelect={(item) =>
              !Array.isArray(item) &&
              setValue("type", item?.id as "document" | "song" | "sermon")
            }
          />

          {/* File Upload */}
          <FileUploadSection type={selectedType} onFileSelect={setFile} />

          {/* Name & Description */}
          <FormInput
            id="name"
            label="Name"
            placeholder="Enter file name"
            register={register("name", { required: "Name is required" })}
            error={errors.name}
          />

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
              setValue(
                "visibility",
                item?.id as "public" | "private" | "admins"
              )
            }
          />

          {errorMessage && (
            <p className="text-sm text-red-500 text-center">{errorMessage}</p>
          )}

          {/* Footer */}
          <div className="flex gap-3 justify-end sticky bottom-0 bg-surface pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader size={16} /> Uploading...
                </div>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
