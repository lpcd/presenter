interface AudioProps {
  src: string;
  title?: string;
  width?: string;
}

export const Audio = ({ src, title, width = "100%" }: AudioProps) => {
  return (
    <div className="my-4 w-full">
      <audio
        controls
        style={{ width, maxWidth: "100%" }}
        className="mx-auto"
        title={title || "Audio"}
      >
        <source src={src} />
        Votre navigateur ne supporte pas la balise audio.
      </audio>
    </div>
  );
};
