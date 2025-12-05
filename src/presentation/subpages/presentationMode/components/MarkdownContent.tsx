import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/vs2015.css";
import {
  Paragraph,
  UnorderedList,
  OrderedList,
  ListItem,
  Code,
  Pre,
  Table,
  TableHead,
  TableBody,
  TableHeader,
  TableCell,
  Blockquote,
  HorizontalRule,
  Strong,
  Emphasis,
  Image,
} from "../atoms";
import { MediaLink } from "./MediaLink";

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
          p: ({ children }) => <Paragraph>{children}</Paragraph>,
          ul: ({ children }) => <UnorderedList>{children}</UnorderedList>,
          ol: ({ children }) => <OrderedList>{children}</OrderedList>,
          li: ({ children }) => <ListItem>{children}</ListItem>,
          a: ({ href, children }) => (
            <MediaLink href={href}>{children}</MediaLink>
          ),
          code: ({ className, children, ...props }) => (
            <Code className={className} {...props}>
              {children}
            </Code>
          ),
          pre: ({ children }) => <Pre>{children}</Pre>,
          table: ({ children }) => <Table>{children}</Table>,
          thead: ({ children }) => <TableHead>{children}</TableHead>,
          tbody: ({ children }) => <TableBody>{children}</TableBody>,
          th: ({ children, style }) => (
            <TableHeader style={style}>{children}</TableHeader>
          ),
          td: ({ children, style }) => (
            <TableCell style={style}>{children}</TableCell>
          ),
          blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
          hr: () => <HorizontalRule />,
          strong: ({ children }) => <Strong>{children}</Strong>,
          em: ({ children }) => <Emphasis>{children}</Emphasis>,
          img: ({ src, alt }) => <Image src={src} alt={alt} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
