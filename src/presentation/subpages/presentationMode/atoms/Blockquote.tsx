import type { ReactNode } from "react";

interface BlockquoteProps {
  children: ReactNode;
}

export const Blockquote = ({ children }: BlockquoteProps) => {
  return (
    <blockquote className="border-l-4 border-primary bg-gray-50 pl-4 py-2 my-4 italic text-gray-700 [&>p]:mb-0">
      {children}
    </blockquote>
  );
};
