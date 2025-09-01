import React from "react";

interface TableProps {
  selectedIds?: string[];
  onSelectAll?: (checked: boolean) => void;
  tableHead: string[];
  rows: React.ReactNode;
  isSelectable?: boolean;
  className?: string;
}

export const RolesTable: React.FC<TableProps> = ({
  selectedIds = [],
  onSelectAll,
  tableHead,
  rows,
  isSelectable = true,
  className = "",
}) => {
  const allSelected =
    selectedIds.length > 0 && typeof onSelectAll === "function";

  return (
    <div
      className={`relative rounded-xl border border-border shadow-sm animate-fade ${className}`}
    >
      <table className="min-w-full text-sm text-left" role="table">
        <thead
          className="bg-border text-xs uppercase font-semibold"
          role="rowgroup"
        >
          <tr role="row">
            {isSelectable && (
              <th className="p-4" role="columnheader">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="accent-primary w-4 h-4 rounded-md border border-border"
                  aria-label="Select all rows"
                />
              </th>
            )}
            {tableHead.map((heading, index) => (
              <th
                key={index}
                className="p-4 text-subText"
                role="columnheader"
                scope="col"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        {/* Make every TD a positioning context for absolute dropdowns */}
        <tbody role="rowgroup" className="[&>tr>td]:relative">
          {rows}
        </tbody>
      </table>
    </div>
  );
};
