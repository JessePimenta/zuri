interface PhotoPrintProps {
  src: string;
  alt: string;
  caption: string;
  tape?: boolean;
  tapeStyle?: "default" | "gray";
}

export const PhotoPrint = ({
  src,
  alt,
  caption,
  tape = false,
  tapeStyle = "default",
}: PhotoPrintProps) => (
  <article className="photo-print">
    {tape && (
      <div
        className="tape"
        style={tapeStyle === "gray" ? { width: 100, background: "rgba(200,200,200,0.2)" } : undefined}
      />
    )}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={src} alt={alt} />
    <div className="font-note" style={{ marginTop: "0.8rem" }}>
      {caption}
    </div>
  </article>
);
