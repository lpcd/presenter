interface EmbedProps {
  src: string;
  title?: string;
  width?: string;
  height?: string;
}

export const Embed = ({
  src,
  title,
  width = "100%",
  height = "400px",
}: EmbedProps) => {
  return (
    <div className="my-4 w-full">
      <embed
        src={src}
        style={{ width, height, maxWidth: "100%" }}
        className="mx-auto rounded-lg"
        title={title || "Contenu"}
      />
    </div>
  );
};
