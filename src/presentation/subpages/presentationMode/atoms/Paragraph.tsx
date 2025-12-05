import type { ReactNode } from "react";

interface ParagraphProps {
  children: ReactNode;
}

export const Paragraph = ({ children }: ParagraphProps) => {
  return <p className="text-gray-700 leading-relaxed mb-4">{children}</p>;
};
