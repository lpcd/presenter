interface IframeProps {
  src: string;
  title?: string;
  width?: string;
  height?: string;
}

export const Iframe = ({
  src,
  title,
  width = "100%",
  height = "400px",
}: IframeProps) => {
  return (
    <div className="my-4 w-full">
      <iframe
        src={src}
        style={{ width, height, maxWidth: "100%" }}
        className="mx-auto border-2 border-gray-300 rounded-lg"
        title={title || "Document"}
      />
    </div>
  );
};
