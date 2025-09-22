import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../../components/ui/Button";
import { Loader } from "../../../../../components/ui/Loader";
import FormInput from "../../../../../components/ui/FormInput";
import { Dropdown } from "../../../../../components/ui/Dropdown";
import Modal from "../../../components/Modal";
import { useDocuments } from "../../../hook/useDocument";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DocumentFormValues {
  name: string;
  descr?: string;
  visibility: "public" | "private" | "admins";
}

const VISIBILITY_OPTIONS = [
  { id: "public", name: "Public" },
  { id: "private", name: "Private" },
  { id: "admins", name: "Admins" },
];

export const DocumentUploadModal = ({
  isOpen,
  onClose,
}: DocumentUploadModalProps) => {
  const { uploadAndCreateDocument, creating, uploading } =
    useDocuments("document");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<DocumentFormValues>({
    defaultValues: {
      name: "",
      descr: "",
      visibility: "public",
    },
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (data: DocumentFormValues) => {
    if (!files.length) {
      setErrorMessage("Please select at least one file.");
      return;
    }

    try {
      setErrorMessage(null);

      // ✅ Use the hook’s combined flow
      await uploadAndCreateDocument({
        files,
        name: data.name,
        descr: data.descr,
        visibility: data.visibility,
      });

      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage("Upload failed. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Custom File Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Files</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-500 transition">
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
            <label
              htmlFor="file-upload"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Click to choose or drag & drop files
            </label>
            {files.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                {files.length} file(s) selected
              </p>
            )}
          </div>
        </div>

        <FormInput
          id="name"
          label="Name"
          placeholder="Enter document name"
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
