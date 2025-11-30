import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/vs2015.css";

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = ({ content }: MarkdownContentProps) => {
  return (
    <div className="prose prose-gray max-w-none overflow-x-hidden z-10">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Styliser les paragraphes
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
          ),
          // Styliser les listes non ordonnées
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 my-4 ml-4">
              {children}
            </ul>
          ),
          // Styliser les listes ordonnées
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 my-4 ml-4">
              {children}
            </ol>
          ),
          // Styliser les items de liste
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed pl-2">{children}</li>
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
          // Styliser le code inline
          code: ({ className, children, ...props }) => {
            // Vérifier si c'est un bloc de code (a une className language-*)
            const isCodeBlock = /language-\w+/.test(className || "");

            if (!isCodeBlock) {
              // Pour le code inline seulement
              return (
                <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-sm">
                  {children}
                </code>
              );
            }

            // Pour les blocs de code, laisser le rendu par défaut
            className = className + " rounded-xl p-2 bg-black/90";
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Styliser les blocs de code
          pre: ({ children }) => <pre className="my-4">{children}</pre>,
          // Styliser les tableaux
          table: ({ children }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="bg-white divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          th: ({ children }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 text-sm text-gray-900 whitespace-normal">
              {children}
            </td>
          ),
          // Styliser les citations
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary bg-gray-50 pl-4 py-2 my-4 italic text-gray-700">
              {children}
            </blockquote>
          ),
          // Styliser strong
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          // Styliser em
          em: ({ children }) => (
            <em className="italic text-gray-700">{children}</em>
          ),
          // Limiter la taille des images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[500px] object-contain mx-auto my-4 rounded-lg"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
