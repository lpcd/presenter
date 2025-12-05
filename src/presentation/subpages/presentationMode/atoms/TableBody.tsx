import type { ReactNode } from "react";

interface TableBodyProps {
  children: ReactNode;
}

export const TableBody = ({ children }: TableBodyProps) => {
  return (
    <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
  );
};
