import type { CSSProperties, ReactNode } from "react";

interface TableHeaderProps {
  children: ReactNode;
  style?: CSSProperties;
}

export const TableHeader = ({ children, style }: TableHeaderProps) => {
  return (
    <th
      className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider"
      style={style}
    >
      {children}
    </th>
  );
};
