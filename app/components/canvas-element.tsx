import type { CanvasElement as CanvasElementType } from "@/lib/db";
import { PhotoPrint } from "./photo-print";
import { AdminNote } from "./admin-note";
import { VideoModule } from "./video-module";
import { Scrap } from "./scrap";
import { ElementEditor } from "./element-editor";
import { RotateHandle } from "./rotate-handle";

interface CanvasElementProps {
  element: CanvasElementType;
  isAdmin?: boolean;
  draftRotate?: number;
  onTransformUpdate?: (id: string, transform: Record<string, unknown>) => void;
  onRotatePreview?: (id: string, degrees: number) => void;
  onRotateEnd?: (id: string, degrees: number) => void;
  onVideoClick?: () => void;
  onDelete?: (id: string) => void;
}

function transformToStyle(
  t: CanvasElementType["transform"],
  rotateOverride?: number
): React.CSSProperties {
  const s: React.CSSProperties = {};
  if (t?.x != null) s.left = t.x;
  if (t?.y != null) s.top = t.y;
  /* width/height not applied – frame sizes to content; min/max width in CSS */
  const rotate = rotateOverride ?? t?.rotate;
  if (rotate != null) s.transform = `rotate(${rotate}deg)`;
  if (t?.z != null) s.zIndex = t.z;
  return s;
}

export const CanvasElement = ({
  element,
  isAdmin = false,
  draftRotate,
  onVideoClick,
  onTransformUpdate,
  onRotatePreview,
  onRotateEnd,
  onDelete,
}: CanvasElementProps) => {
  const t = element.transform ?? {};
  const style = {
    ...transformToStyle(t, draftRotate),
    ...(element.style as React.CSSProperties),
  };
  const caption = (element.style as { caption?: string })?.caption ?? "";
  const tape = (element.style as { tape?: boolean })?.tape ?? false;
  const tapeStyle = ((element.style as { tapeStyle?: string })?.tapeStyle ?? "default") as "default" | "gray";

  const handleDragEnd = onTransformUpdate
    ? (x: number, y: number) => {
        onTransformUpdate(element.id, { ...t, x, y });
      }
    : undefined;

  const canDrag = !!onTransformUpdate;
  const effectiveRotate = draftRotate ?? t?.rotate ?? 0;

  switch (element.type) {
    case "image":
      return (
        <Scrap
          id={element.id}
          style={style}
          onDragEnd={handleDragEnd}
          draggable={canDrag}
        >
          <PhotoPrint
            src={element.content}
            alt={caption}
            caption={caption}
            tape={tape}
            tapeStyle={tapeStyle}
          />
          {isAdmin && (
            <>
              <ElementEditor elementId={element.id} onDelete={onDelete} />
              <RotateHandle
                elementId={element.id}
                rotate={effectiveRotate}
                onRotatePreview={(deg) => onRotatePreview?.(element.id, deg)}
                onRotateEnd={(deg) => onRotateEnd?.(element.id, deg)}
              />
            </>
          )}
        </Scrap>
      );
    case "video":
    case "youtube":
      return (
        <VideoElement
          element={element}
          style={style}
          canDrag={canDrag}
          isAdmin={isAdmin}
          draftRotate={draftRotate}
          onDragEnd={handleDragEnd}
          onRotatePreview={onRotatePreview}
          onRotateEnd={onRotateEnd}
          onDelete={onDelete}
          onVideoClick={onVideoClick}
        />
      );
    case "text":
      return (
        <Scrap
          id={element.id}
          style={style}
          onDragEnd={handleDragEnd}
          draggable={canDrag}
        >
          <AdminNote>{element.content}</AdminNote>
          {isAdmin && (
            <>
              <ElementEditor elementId={element.id} onDelete={onDelete} />
              <RotateHandle
                elementId={element.id}
                rotate={effectiveRotate}
                onRotatePreview={(deg) => onRotatePreview?.(element.id, deg)}
                onRotateEnd={(deg) => onRotateEnd?.(element.id, deg)}
              />
            </>
          )}
        </Scrap>
      );
    case "link":
      return (
        <Scrap
          id={element.id}
          style={style}
          onDragEnd={handleDragEnd}
          draggable={canDrag}
        >
          <a
            href={element.content}
            target="_blank"
            rel="noopener noreferrer"
            className="font-note"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            {caption || element.content}
          </a>
          {isAdmin && (
            <>
              <ElementEditor elementId={element.id} onDelete={onDelete} />
              <RotateHandle
                elementId={element.id}
                rotate={effectiveRotate}
                onRotatePreview={(deg) => onRotatePreview?.(element.id, deg)}
                onRotateEnd={(deg) => onRotateEnd?.(element.id, deg)}
              />
            </>
          )}
        </Scrap>
      );
    default:
      return null;
  }
};

function VideoElement({
  element,
  style,
  canDrag,
  isAdmin,
  draftRotate,
  onDragEnd,
  onRotatePreview,
  onRotateEnd,
  onDelete,
  onVideoClick,
}: {
  element: CanvasElementType;
  style: React.CSSProperties;
  canDrag: boolean;
  isAdmin: boolean;
  draftRotate?: number;
  onDragEnd?: (x: number, y: number) => void;
  onRotatePreview?: (id: string, degrees: number) => void;
  onRotateEnd?: (id: string, degrees: number) => void;
  onDelete?: (id: string) => void;
  onVideoClick?: () => void;
}) {
  const t = element.transform ?? {};
  const effectiveRotate = draftRotate ?? t?.rotate ?? 0;
  const label = (element.style as { label?: string })?.label ?? "PLAY";
  const footerLabel = (element.style as { footerLabel?: string })?.footerLabel;
  const isYoutube = element.type === "youtube" && element.content?.includes("youtube.com/embed/");

  return (
    <Scrap
      id={element.id}
      style={style}
      onDragEnd={onDragEnd}
      draggable={canDrag}
    >
      {isYoutube ? (
        <div
          className="youtube-embed-wrap"
          style={{
            width: 320,
            height: 180,
            minWidth: 280,
            minHeight: 158,
            maxWidth: "100%",
            borderRadius: 4,
            overflow: "hidden",
            background: "#000",
          }}
        >
          <iframe
            src={element.content}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onVideoClick?.();
          }}
          style={{ cursor: onVideoClick ? "pointer" : "default" }}
        >
          <VideoModule
            playLabel={label}
            footer={
              footerLabel ? (
                <div
                  className="font-ui"
                  style={{ padding: "0.8rem", fontSize: "0.6rem" }}
                >
                  {footerLabel}
                </div>
              ) : undefined
            }
            onClick={undefined}
          />
        </div>
      )}
      {isAdmin && (
        <>
          <ElementEditor elementId={element.id} onDelete={onDelete} />
          <RotateHandle
            elementId={element.id}
            rotate={effectiveRotate}
            onRotatePreview={(deg) => onRotatePreview?.(element.id, deg)}
            onRotateEnd={(deg) => onRotateEnd?.(element.id, deg)}
          />
        </>
      )}
    </Scrap>
  );
}
