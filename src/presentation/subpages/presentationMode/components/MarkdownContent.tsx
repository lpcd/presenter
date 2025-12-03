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
          p: ({ children }) => (
            <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 my-4 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 my-4 ml-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700 leading-relaxed pl-2">{children}</li>
          ),
          a: ({ href, children }) => {
            if (!href) {
              return (
                <a className="text-primary hover:text-blue-700 underline">
                  {children}
                </a>
              );
            }

            // Extraire le texte des children pour détecter les codes
            const childText =
              typeof children === "string"
                ? children
                : Array.isArray(children)
                ? children.join("")
                : "";

            // Regex pour détecter le code et les dimensions (ex: "Video 400x300 VIDEO")
            const mediaMatch = childText.match(
              /^(.*?)\s*(?:(\d+)(?:x(\d+))?)?\s*(VIDEO|AUDIO|URL|PDF|EMBED)$/i
            );

            if (mediaMatch) {
              const [, title, width, height, code] = mediaMatch;
              const mediaType = code.toUpperCase();
              const actualTitle = title.trim();
              const w = width ? `${width}px` : "100%";
              const h = height ? `${height}px` : "400px";

              // Construire l'URL réelle pour les ressources locales
              let actualHref = href;
              if (
                href.startsWith("./ressources/") ||
                href.startsWith("ressources/")
              ) {
                const cleanPath = href.replace(/^\.?\//, "");
                const pathParts = window.location.pathname.split("/");
                const presentationId =
                  pathParts[pathParts.indexOf("presentations") + 1];
                actualHref = `/presentations/${presentationId}/${cleanPath}`;
              }
              // Les chemins absolus /ressources/ sont déjà corrects

              // VIDEO
              if (mediaType === "VIDEO") {
                return (
                  <div className="my-4 w-full">
                    <video
                      controls
                      style={{ width: w, height: h, maxWidth: "100%" }}
                      className="mx-auto rounded-lg"
                      title={actualTitle || "Video"}
                    >
                      <source src={actualHref} />
                      Votre navigateur ne supporte pas la balise vidéo.
                    </video>
                  </div>
                );
              }

              // AUDIO
              if (mediaType === "AUDIO") {
                return (
                  <div className="my-4 w-full">
                    <audio
                      controls
                      style={{ width: w, maxWidth: "100%" }}
                      className="mx-auto"
                      title={actualTitle || "Audio"}
                    >
                      <source src={actualHref} />
                      Votre navigateur ne supporte pas la balise audio.
                    </audio>
                  </div>
                );
              }

              // URL ou PDF (iframe)
              if (mediaType === "URL" || mediaType === "PDF") {
                return (
                  <div className="my-4 w-full">
                    <iframe
                      src={actualHref}
                      style={{ width: w, height: h, maxWidth: "100%" }}
                      className="mx-auto border-2 border-gray-300 rounded-lg"
                      title={actualTitle || "Document"}
                    />
                  </div>
                );
              }

              // EMBED
              if (mediaType === "EMBED") {
                return (
                  <div className="my-4 w-full">
                    <embed
                      src={actualHref}
                      style={{ width: w, height: h, maxWidth: "100%" }}
                      className="mx-auto rounded-lg"
                      title={actualTitle || "Contenu"}
                    />
                  </div>
                );
              }
            }

            // Lien normal
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
          },
          code: ({ className, children, ...props }) => {
            const isCodeBlock = /language-\w+/.test(className || "");

            if (!isCodeBlock) {
              return (
                <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono text-sm">
                  {children}
                </code>
              );
            }

            className = className + " rounded-xl p-2 bg-black/90";
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => <pre className="my-4">{children}</pre>,
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
          th: ({ children, style }) => (
            <th
              className="px-6 py-3 text-xs font-medium text-gray-700 uppercase tracking-wider"
              style={style}
            >
              {children}
            </th>
          ),
          td: ({ children, style }) => (
            <td
              className="px-6 py-4 text-sm text-gray-900 whitespace-normal"
              style={style}
            >
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary bg-gray-50 pl-4 py-2 my-4 italic text-gray-700 [&>p]:mb-0">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-6 border-gray-300" />,
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-700">{children}</em>
          ),
          img: ({ src, alt }) => {
            if (!src) return null;

            if (src.endsWith(".pdf")) {
              return (
                <div className="my-4 w-full">
                  <iframe
                    src={src}
                    className="w-full h-[600px] border-2 border-gray-300 rounded-lg"
                    title={alt || "PDF Document"}
                  />
                </div>
              );
            }

            // Extraire les dimensions et le code du alt
            const match = alt?.match(
              /^(.+?)\s+(\d+)(?:x(\d+))?(?:\s+(VIDEO|AUDIO|URL|PDF|EMBED))?$/i
            );

            let width: string | undefined;
            let height: string | undefined;
            let actualAlt = alt;
            let captionText = alt;

            if (match) {
              actualAlt = match[1];
              captionText = match[1]; // Titre sans dimensions ni code
              width = match[2] + "px";
              height = match[3] ? match[3] + "px" : "auto";
            }

            let actualSrc = src;
            if (
              src.startsWith("./ressources/") ||
              src.startsWith("ressources/")
            ) {
              const cleanPath = src.replace(/^\.?\//, "");
              const pathParts = window.location.pathname.split("/");
              const presentationId =
                pathParts[pathParts.indexOf("presentations") + 1];
              actualSrc = `/presentations/${presentationId}/${cleanPath}`;
            }
            // Les chemins absolus /ressources/ sont déjà corrects

            return (
              <figure className="my-4">
                <img
                  src={actualSrc}
                  alt={actualAlt}
                  style={{
                    maxWidth: width || "100%",
                    height: height || "auto",
                    maxHeight: height ? height : "500px",
                  }}
                  className="object-contain mx-auto rounded-lg"
                />
                {captionText && (
                  <figcaption className="text-center text-sm text-gray-600 mt-2 italic">
                    {captionText}
                  </figcaption>
                )}
              </figure>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
