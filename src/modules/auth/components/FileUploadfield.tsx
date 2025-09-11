import { FaUpload } from "react-icons/fa6";
import clsx from "clsx";
import { type UseFormRegisterReturn } from "react-hook-form";

type FileUploadFieldProps = {
  label: string;
  register: UseFormRegisterReturn;
};

export function FileUploadField({ label, register }: FileUploadFieldProps) {
  return (
    <label
      className={clsx(
        "flex items-center justify-between w-full h-12 px-4 text-sm text-text bg-background border border-border rounded-xl",
        "hover:bg-neutral/10 hover:text-accent transition-all duration-200",
        "focus-within:ring-1 focus-within:ring-accent"
      )}
    >
      <span>{label}</span>
      <FaUpload className="text-sm text-text-placeholder" />
      <input type="file" className="hidden" {...register} />
    </label>
  );
}
