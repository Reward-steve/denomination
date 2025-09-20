import { useState, useCallback } from "react";
import { FaUpload, FaTrash } from "react-icons/fa6";

const ALLOWED_FILE_TYPES: Record<"document" | "song" | "sermon", string[]> = {
  document: [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/rtf",
    "text/plain",
  ],
  song: ["audio/mpeg", "audio/wav", "audio/ogg"],
  sermon: ["video/mp4", "video/quicktime", "audio/mpeg", "audio/wav"],
};

interface FileUploadSectionProps {
  type: "document" | "song" | "sermon";
  onFileSelect: (file: File | null) => void;
}

export const FileUploadSection = ({
  type,
  onFileSelect,
}: FileUploadSectionProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (selected: File) => {
    const isValid = ALLOWED_FILE_TYPES[type]?.includes(selected.type);
    if (!isValid) {
      setError(
        `Invalid file type. Allowed: ${ALLOWED_FILE_TYPES[type].join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleFile = (selected: File) => {
    if (!validateFile(selected)) {
      onFileSelect(null);
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selected);
    onFileSelect(selected);
    setError(null);

    if (selected.type.startsWith("image")) {
      setPreview(URL.createObjectURL(selected));
    } else if (
      selected.type.startsWith("audio") ||
      selected.type.startsWith("video")
    ) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleFile(dropped);
    },
    [type]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <section className="border rounded-lg p-4 border-border bg-background">
      {!file ? (
        <div
          className="flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-primary rounded-lg p-6 text-center hover:bg-background/50 transition"
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <FaUpload className="text-primary mb-2" size={24} />
          <span className="text-sm">Drag & Drop or Click to Upload</span>
          <input
            id="fileInput"
            type="file"
            accept={ALLOWED_FILE_TYPES[type]?.join(",")}
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {preview && file.type.startsWith("image") && (
            <img
              src={preview}
              alt="Preview"
              className="max-h-40 object-contain mx-auto rounded-lg"
            />
          )}
          {preview && file.type.startsWith("audio") && (
            <audio controls className="w-full">
              <source src={preview} type={file.type} />
              Your browser does not support the audio tag.
            </audio>
          )}
          {preview && file.type.startsWith("video") && (
            <video controls className="w-full max-h-60 rounded-lg">
              <source src={preview} type={file.type} />
              Your browser does not support the video tag.
            </video>
          )}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{file.name}</p>
            <button
              type="button"
              onClick={clearFile}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </section>
  );
};
