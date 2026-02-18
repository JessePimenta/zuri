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
  onVideoClick?: () => void;
  onTransformUpdate?: (id: string, transform: Record<string, unknown>) => void;
  onDelete?: (id: string) => void;
}

function transformToStyle(t: CanvasElementType["transform"]): React.CSSProperties {
  const s: React.CSSProperties = {};
  if (t?.x != null) s.left = t.x;
  if (t?.y != null) s.top = t.y;
  if (t?.w != null) s.width = t.w;
  if (t?.h != null) s.height = t.h;
  if (t?.rotate != null) s.transform = `rotate(${t.rotate}deg)`;
  if (t?.z != null) s.zIndex = t.z;
  return s;
}

export const CanvasElement = ({
  element,
  isAdmin = false,
  onVideoClick,
  onTransformUpdate,
  onDelete,
}: CanvasElementProps) => {
  const t = element.transform ?? {};
  const style = { ...transformToStyle(t), ...(element.style as React.CSSProperties) };
  const caption = (element.style as { caption?: string })?.caption ?? "";
  const tape = (element.style as { tape?: boolean })?.tape ?? false;
  const tapeStyle = ((element.style as { tapeStyle?: string })?.tapeStyle ?? "default") as "default" | "gray";

  const handleDragEnd = onTransformUpdate
    ? (x: number, y: number) => {
        onTransformUpdate(element.id, { ...t, x, y });
      }
    : undefined;

  const handleRotateChange = onTransformUpdate
    ? (rotate: number) => {
        onTransformUpdate(element.id, { ...t, rotate });
      }
    : undefined;

  const canDrag = !!onTransformUpdate;

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
                rotate={t?.rotate ?? 0}
                onRotateChange={handleRotateChange!}
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
          onDragEnd={handleDragEnd}
          onRotateChange={handleRotateChange}
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
                rotate={t?.rotate ?? 0}
                onRotateChange={handleRotateChange!}
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
                rotate={t?.rotate ?? 0}
                onRotateChange={handleRotateChange!}
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
  onDragEnd,
  onRotateChange,
  onDelete,
  onVideoClick,
}: {
  element: CanvasElementType;
  style: React.CSSProperties;
  canDrag: boolean;
  isAdmin: boolean;
  onDragEnd?: (x: number, y: number) => void;
  onRotateChange?: (degrees: number) => void;
  onDelete?: (id: string) => void;
  onVideoClick?: () => void;
}) {
  const t = element.transform ?? {};
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
            rotate={t?.rotate ?? 0}
            onRotateChange={onRotateChange!}
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
