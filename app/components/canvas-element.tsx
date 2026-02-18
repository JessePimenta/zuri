import type { CanvasElement as CanvasElementType } from "@/lib/db";
import { PhotoPrint } from "./photo-print";
import { AdminNote } from "./admin-note";
import { VideoModule } from "./video-module";
import { Scrap } from "./scrap";
import { ElementEditor } from "./element-editor";
import { RotateHandle } from "./rotate-handle";
import { ResizeHandle } from "./resize-handle";

interface CanvasElementProps {
  element: CanvasElementType;
  isAdmin?: boolean;
  draftRotate?: number;
  draftResize?: Record<string, unknown>;
  onTransformUpdate?: (id: string, transform: Record<string, unknown>) => void;
  onRotatePreview?: (id: string, degrees: number) => void;
  onRotateEnd?: (id: string, degrees: number) => void;
  onResizePreview?: (id: string, partial: Record<string, unknown>) => void;
  onResizeEnd?: (id: string, partial: Record<string, unknown>) => void;
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
  draftResize,
  onVideoClick,
  onTransformUpdate,
  onRotatePreview,
  onRotateEnd,
  onResizePreview,
  onResizeEnd,
  onDelete,
}: CanvasElementProps) => {
  const t = element.transform ?? {};
  const effectiveTransform = { ...t, ...draftResize } as CanvasElementType["transform"];
  const hasExplicitSize =
    effectiveTransform?.w != null && effectiveTransform?.h != null;
  const style = {
    ...transformToStyle(effectiveTransform, draftRotate),
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
          {hasExplicitSize ? (
            <div className="scrap-content-fill">
              <PhotoPrint
                src={element.content}
                alt={caption}
                caption={caption}
                tape={tape}
                tapeStyle={tapeStyle}
              />
            </div>
          ) : (
            <PhotoPrint
              src={element.content}
              alt={caption}
              caption={caption}
              tape={tape}
              tapeStyle={tapeStyle}
            />
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
              <ResizeHandle
                elementId={element.id}
                transform={effectiveTransform}
                onResizePreview={(partial) => onResizePreview?.(element.id, partial)}
                onResizeEnd={(partial) => onResizeEnd?.(element.id, partial)}
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
          draftResize={draftResize}
          onDragEnd={handleDragEnd}
          onRotatePreview={onRotatePreview}
          onRotateEnd={onRotateEnd}
          onResizePreview={onResizePreview}
          onResizeEnd={onResizeEnd}
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
          {hasExplicitSize ? (
            <div className="scrap-content-fill">
              <AdminNote>{element.content}</AdminNote>
            </div>
          ) : (
            <AdminNote>{element.content}</AdminNote>
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
              <ResizeHandle
                elementId={element.id}
                transform={effectiveTransform}
                onResizePreview={(partial) => onResizePreview?.(element.id, partial)}
                onResizeEnd={(partial) => onResizeEnd?.(element.id, partial)}
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
          {hasExplicitSize ? (
            <div className="scrap-content-fill">
              <a
                href={element.content}
                target="_blank"
                rel="noopener noreferrer"
                className="font-note"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                {caption || element.content}
              </a>
            </div>
          ) : (
            <a
              href={element.content}
              target="_blank"
              rel="noopener noreferrer"
              className="font-note"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              {caption || element.content}
            </a>
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
              <ResizeHandle
                elementId={element.id}
                transform={effectiveTransform}
                onResizePreview={(partial) => onResizePreview?.(element.id, partial)}
                onResizeEnd={(partial) => onResizeEnd?.(element.id, partial)}
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
  draftResize,
  onDragEnd,
  onRotatePreview,
  onRotateEnd,
  onResizePreview,
  onResizeEnd,
  onDelete,
  onVideoClick,
}: {
  element: CanvasElementType;
  style: React.CSSProperties;
  canDrag: boolean;
  isAdmin: boolean;
  draftRotate?: number;
  draftResize?: Record<string, unknown>;
  onDragEnd?: (x: number, y: number) => void;
  onRotatePreview?: (id: string, degrees: number) => void;
  onRotateEnd?: (id: string, degrees: number) => void;
  onResizePreview?: (id: string, partial: Record<string, unknown>) => void;
  onResizeEnd?: (id: string, partial: Record<string, unknown>) => void;
  onDelete?: (id: string) => void;
  onVideoClick?: () => void;
}) {
  const t = element.transform ?? {};
  const effectiveTransform = { ...t, ...draftResize } as CanvasElementType["transform"];
  const hasExplicitSize = effectiveTransform?.w != null && effectiveTransform?.h != null;
  const effectiveRotate = draftRotate ?? t?.rotate ?? 0;
  const label = (element.style as { label?: string })?.label ?? "PLAY";
  const footerLabel = (element.style as { footerLabel?: string })?.footerLabel;
  const videoContent = (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onVideoClick?.();
      }}
      style={{ cursor: onVideoClick ? "pointer" : "default", height: "100%" }}
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
  );
  return (
    <Scrap
      id={element.id}
      style={style}
      onDragEnd={onDragEnd}
      draggable={canDrag}
    >
      {hasExplicitSize ? (
        <div className="scrap-content-fill">{videoContent}</div>
      ) : (
        videoContent
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
          <ResizeHandle
            elementId={element.id}
            transform={effectiveTransform}
            onResizePreview={(partial) => onResizePreview?.(element.id, partial)}
            onResizeEnd={(partial) => onResizeEnd?.(element.id, partial)}
          />
        </>
      )}
    </Scrap>
  );
}
