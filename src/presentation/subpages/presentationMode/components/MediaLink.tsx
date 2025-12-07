import type { ReactNode } from "react";
import { Video } from "../atoms/Video";
import { Audio } from "../atoms/Audio";
import { Iframe } from "../atoms/Iframe";
import { Embed } from "../atoms/Embed";
import { Link } from "../atoms/Link";

interface MediaLinkProps {
  href?: string;
  children: ReactNode;
}

export const MediaLink = ({ href, children }: MediaLinkProps) => {
  if (!href) {
    return <Link href={href}>{children}</Link>;
  }

  const childText =
    typeof children === "string"
      ? children
      : Array.isArray(children)
      ? children.join("")
      : "";

  const mediaMatch = childText.match(
    /^(.*?)\s*(?:(\d+)(?:x(\d+))?)?\s*(VIDEO|AUDIO|URL|PDF|EMBED)$/i
  );

  if (mediaMatch) {
    const [, title, width, height, code] = mediaMatch;
    const mediaType = code.toUpperCase();
    const actualTitle = title.trim();
    const w = width ? `${width}px` : "100%";
    const h = height ? `${height}px` : "400px";

    let actualHref = href;
    if (href.startsWith("./ressources/") || href.startsWith("ressources/")) {
      const cleanPath = href.replace(/^\.?\//, "");
      const pathParts = window.location.pathname.split("/");
      const presentationId = pathParts[pathParts.indexOf("presentations") + 1];
      actualHref = `/presentations/${presentationId}/${cleanPath}`;
    }

    if (mediaType === "VIDEO") {
      return (
        <Video src={actualHref} title={actualTitle} width={w} height={h} />
      );
    }

    if (mediaType === "AUDIO") {
      return <Audio src={actualHref} title={actualTitle} width={w} />;
    }

    if (mediaType === "URL" || mediaType === "PDF") {
      return (
        <Iframe src={actualHref} title={actualTitle} width={w} height={h} />
      );
    }

    if (mediaType === "EMBED") {
      return (
        <Embed src={actualHref} title={actualTitle} width={w} height={h} />
      );
    }
  }

  return <Link href={href}>{children}</Link>;
};
