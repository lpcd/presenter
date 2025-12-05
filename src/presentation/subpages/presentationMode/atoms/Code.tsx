import type { ReactNode } from "react";

interface CodeProps {
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
}

export const Code = ({ className, children, ...props }: CodeProps) => {
  const isCodeBlock = /language-\w+/.test(className || "");

  if (!isCodeBlock) {
    return (
      <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-sm">
        {children}
      </code>
    );
  }

  const updatedClassName = className + " rounded-xl p-2 bg-black/90";
  return (
    <code className={updatedClassName} {...props}>
      {children}
    </code>
  );
};
