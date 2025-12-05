import type { ReactNode } from "react";

interface LinkProps {
  href?: string;
  children: ReactNode;
}

export const Link = ({ href, children }: LinkProps) => {
  if (!href) {
    return (
      <a className="text-primary hover:text-blue-700 underline">{children}</a>
    );
  }

  return (
    <a
      href={href}
      className="text-primary hover:text-blue-700 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
