interface VideoModuleProps {
  playLabel: string;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export const VideoModule = ({ playLabel, footer, onClick }: VideoModuleProps) => (
  <article className="video-module" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick?.()}>
    <div className="video-placeholder">
      <div className="font-ui play-btn">{playLabel}</div>
    </div>
    {footer}
  </article>
);
