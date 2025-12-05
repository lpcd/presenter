import type { ReactNode } from "react";

interface EmphasisProps {
  children: ReactNode;
}

export const Emphasis = ({ children }: EmphasisProps) => {
  return <em className="italic text-gray-700">{children}</em>;
};
