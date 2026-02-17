interface VideoModuleProps {
  playLabel: string;
  footer?: React.ReactNode;
}

export const VideoModule = ({ playLabel, footer }: VideoModuleProps) => (
  <article className="video-module">
    <div className="video-placeholder">
      <div className="font-ui play-btn">{playLabel}</div>
    </div>
    {footer}
  </article>
);
