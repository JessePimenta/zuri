interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox = ({ isOpen, onClose }: LightboxProps) => {
  if (!isOpen) return null;
  return (
    <div
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      onClick={onClose}
      style={{
        display: "flex",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "black",
        zIndex: 9999,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="video-content"
        style={{
          width: "80%",
          height: "80%",
          background: "#111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#080808",
          }}
        >
          <div
            className="font-tag"
            style={{ color: "white", fontSize: "2rem" }}
          >
            [ VIDEO_SIGNAL_ACTIVE ]
          </div>
        </div>
        <div
          className="font-ui"
          style={{ marginTop: "2rem", color: "#666" }}
        >
          CLICK ANYWHERE TO CLOSE
        </div>
      </div>
    </div>
  );
};
