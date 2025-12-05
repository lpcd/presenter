import type { CSSProperties, ReactNode } from "react";

interface TableCellProps {
  children: ReactNode;
  style?: CSSProperties;
}

export const TableCell = ({ children, style }: TableCellProps) => {
  return (
    <td
      className="px-6 py-4 text-sm text-gray-900 whitespace-normal"
      style={style}
    >
      {children}
    </td>
  );
};
