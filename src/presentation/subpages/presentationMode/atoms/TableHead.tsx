import type { ReactNode } from "react";

interface TableHeadProps {
  children: ReactNode;
}

export const TableHead = ({ children }: TableHeadProps) => {
  return <thead className="bg-gray-50">{children}</thead>;
};
