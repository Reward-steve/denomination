import React from "react";

interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder: string;
}

const FilterSelect = ({ value, onChange, options, placeholder }: Props) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full border p-2 rounded text-sm text-text"
  >
    <option value="">{placeholder}</option>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);

export default FilterSelect;
