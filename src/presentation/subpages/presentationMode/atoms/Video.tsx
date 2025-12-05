interface VideoProps {
  src: string;
  title?: string;
  width?: string;
  height?: string;
}

export const Video = ({
  src,
  title,
  width = "100%",
  height = "400px",
}: VideoProps) => {
  return (
    <div className="my-4 w-full">
      <video
        controls
        style={{ width, height, maxWidth: "100%" }}
        className="mx-auto rounded-lg"
        title={title || "Video"}
      >
        <source src={src} />
        Votre navigateur ne supporte pas la balise vidéo.
      </video>
    </div>
  );
};
