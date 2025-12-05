import type { ReactNode } from "react";

interface UnorderedListProps {
  children: ReactNode;
}

export const UnorderedList = ({ children }: UnorderedListProps) => {
  return (
    <ul className="list-disc list-inside space-y-2 my-4 ml-4">{children}</ul>
  );
};
