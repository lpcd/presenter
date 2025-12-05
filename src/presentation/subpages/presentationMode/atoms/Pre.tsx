import type { ReactNode } from "react";

interface PreProps {
  children: ReactNode;
}

export const Pre = ({ children }: PreProps) => {
  return <pre className="my-4">{children}</pre>;
};
