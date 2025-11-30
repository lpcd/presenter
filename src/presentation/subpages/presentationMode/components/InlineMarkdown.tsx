import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface InlineMarkdownProps {
  content: string;
  className?: string;
}

export const InlineMarkdown = ({
  content,
  className = "",
}: InlineMarkdownProps) => {
  return (
    <span className={`inline-markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Forcer le rendu inline en supprimant les paragraphes
          p: ({ children }) => <>{children}</>,
          // Styliser strong
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          // Styliser em
          em: ({ children }) => <em className="italic">{children}</em>,
          // Styliser le code inline
          code: ({ children }) => (
            <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-sm">
              {children}
            </code>
          ),
          // Styliser les liens
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </span>
  );
};
