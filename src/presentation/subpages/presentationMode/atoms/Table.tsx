import type { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
}

export const Table = ({ children }: TableProps) => {
  return (
    <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 border-collapse">
        {children}
      </table>
    </div>
  );
};
