import type { ReactNode } from "react";

interface StrongProps {
  children: ReactNode;
}

export const Strong = ({ children }: StrongProps) => {
  return <strong className="font-bold text-gray-900">{children}</strong>;
};
