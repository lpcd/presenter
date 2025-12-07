interface ImageProps {
  src?: string;
  alt?: string;
}

export const Image = ({ src, alt }: ImageProps) => {
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

  const match = alt?.match(
    /^(.+?)\s+(\d+)(?:x(\d+))?(?:\s+(VIDEO|AUDIO|URL|PDF|EMBED))?$/i
  );

  let width: string | undefined;
  let height: string | undefined;
  let actualAlt = alt;
  let captionText = alt;

  if (match) {
    actualAlt = match[1];
    captionText = match[1];
    width = match[2] + "px";
    height = match[3] ? match[3] + "px" : "auto";
  }

  let actualSrc = src;
  if (src.startsWith("./ressources/") || src.startsWith("ressources/")) {
    const cleanPath = src.replace(/^\.?\//, "");
    const pathParts = window.location.pathname.split("/");
    const presentationId = pathParts[pathParts.indexOf("presentations") + 1];
    actualSrc = `/presentations/${presentationId}/${cleanPath}`;
  }

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
};
