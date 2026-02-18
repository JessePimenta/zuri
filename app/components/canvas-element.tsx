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
  if (t?.w != null) s.width = t.w;
  if (t?.h != null) s.height = t.h;
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
          <PhotoPrint
            src={element.content}
            alt={caption}
            caption={caption}
            tape={tape}
            tapeStyle={tapeStyle}
          />
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
          <AdminNote>{element.content}</AdminNote>
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
          <a
            href={element.content}
            target="_blank"
            rel="noopener noreferrer"
            className="font-note"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            {caption || element.content}
          </a>
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
  return (
    <Scrap
      id={element.id}
      style={style}
      onDragEnd={onDragEnd}
      draggable={canDrag}
    >
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
    </Scrap>
  );
}
