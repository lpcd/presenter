import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

interface PreProps {
  children: ReactNode;
}

const extractText = (node: ReactNode): string => {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in (node as object)) {
    const el = node as { props: { children?: ReactNode } };
    return extractText(el.props.children);
  }
  return "";
};

export const Pre = ({ children }: PreProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = extractText(children);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  return (
    <div className="relative group my-4">
      <pre>{children}</pre>
      <button
        onClick={handleCopy}
        title="Copier le code"
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
        aria-label="Copier le code"
      >
        {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
      </button>
    </div>
  );
};
