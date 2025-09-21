import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../components/ui/Button";
import { Loader } from "../../../../../components/ui/Loader";
import { FileUploadSection } from "../components/FileUploadSection";
import FormInput from "../../../../../components/ui/FormInput";
import { Dropdown } from "../../../../../components/ui/Dropdown";
import Modal from "../../../components/Modal";
import type { DocumentFile } from "../../../types";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleAddFile: (file: DocumentFile) => void;
}

interface DocumentFormValues {
  name: string;
  descr?: string;
  visibility: "public" | "private" | "admins";
  type: "document";
}

const VISIBILITY_OPTIONS = [
  { id: "public", name: "Public" },
  { id: "private", name: "Private" },
  { id: "admins", name: "Admins" },
];

export const DocumentUploadModal = ({
  isOpen,
  onClose,
  handleAddFile,
}: DocumentUploadModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
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

  const onSubmit = async (data: DocumentFormValues) => {
    if (!file) return setErrorMessage("Please select a file to upload.");

    try {
      setErrorMessage(null);
      const storagePath = `storage/documents/${file.name.replace(/\s+/g, "_")}`;
      await new Promise((res) => setTimeout(res, 1000));

      const newDoc: DocumentFile = {
        name: data.name,
        size: file.size,
        type: "document",
        uploadedAt: new Date().toISOString(),
        document: [storagePath],
        visibility: data.visibility,
      };

      handleAddFile(newDoc);
      onClose();
    } catch {
      setErrorMessage("Upload failed. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FileUploadSection type="document" onFileSelect={setFile} />

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

        <Dropdown
          label="Visibility"
          placeholder="Select visibility"
          items={VISIBILITY_OPTIONS}
          displayValueKey="name"
          value={VISIBILITY_OPTIONS.find((v) => v.id === "public") || null}
          onSelect={(item) =>
            !Array.isArray(item) &&
            setValue("visibility", item?.id as "public" | "private" | "admins")
          }
        />

        {errorMessage && (
          <p className="text-sm text-red-500 text-center">{errorMessage}</p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
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
    </Modal>
  );
};
