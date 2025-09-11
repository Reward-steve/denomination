import { type ControllerRenderProps } from "react-hook-form";
import { Dropdown } from "../../../components/ui/Dropdown";

type DropdownFieldProps<T> = {
  field: ControllerRenderProps<any, any>;
  label: string;
  items: Record<string, any>[] | string[];
  displayValueKey: keyof T;
  error?: string;
};

export function DropdownField<T>({
  field,
  label,
  items,
  displayValueKey,
  error,
}: DropdownFieldProps<T>) {
  return (
    <Dropdown
      label={label}
      placeholder="Select option"
      items={items}
      displayValueKey={displayValueKey as string}
      size="big"
      onSelect={(item) => field.onChange(item[displayValueKey])}
      isError={!!error}
      errorMsg={error}
      value={field.value}
    />
  );
}
