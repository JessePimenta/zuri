"use client";

import { useState } from "react";
import type { CanvasElement, Comment } from "@/lib/db";
import { Nav } from "./nav";
import { DarkModeToggle } from "./dark-mode-toggle";
import { CanvasElement as CanvasElementCmp } from "./canvas-element";
import { StickyNote } from "./sticky-note";
import { Lightbox } from "./lightbox";
import { Scrap } from "./scrap";
import { CommentForm } from "./comment-form";

export interface CanvasViewProps {
  elements: CanvasElement[];
  isAdmin: boolean;
  /** Admin-only: draft rotate per element id */
  draftRotate?: Record<string, number>;
  onTransformUpdate?: (id: string, transform: Record<string, unknown>) => void;
  onRotatePreview?: (id: string, degrees: number) => void;
  onRotateEnd?: (id: string, degrees: number) => void;
  onDelete?: (id: string) => void;
  /** Public-only: for lightbox */
  onVideoClick?: () => void;
  /** Public-only: for sticky note */
  comments?: Comment[];
  /** Optional class for container (e.g. admin-canvas-preview) */
  containerClassName?: string;
}

export const CanvasView = ({
  elements,
  isAdmin,
  draftRotate,
  onTransformUpdate,
  onRotatePreview,
  onRotateEnd,
  onDelete,
  onVideoClick,
  comments = [],
  containerClassName,
}: CanvasViewProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const effectiveVideoClick = isAdmin ? undefined : (onVideoClick ?? (() => setLightboxOpen(true)));

  return (
    <div
      className={["canvas-container", containerClassName].filter(Boolean).join(" ")}
    >
      <Nav />
      {!isAdmin && <DarkModeToggle />}

      {elements.map((el) => (
        <CanvasElementCmp
          key={el.id}
          element={el}
          isAdmin={isAdmin}
          draftRotate={isAdmin ? draftRotate?.[el.id] : undefined}
          onTransformUpdate={onTransformUpdate}
          onRotatePreview={onRotatePreview}
          onRotateEnd={onRotateEnd}
          onDelete={onDelete}
          onVideoClick={effectiveVideoClick}
        />
      ))}

      {!isAdmin && (
        <Scrap
          id="note-1"
          className="testimonial-bar"
          style={{ bottom: "2rem", left: "2rem", transform: "rotate(-4deg)" }}
          isNote
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
            <StickyNote comments={comments} />
            <CommentForm />
          </div>
        </Scrap>
      )}

      {!isAdmin && (
        <Lightbox isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
      )}
    </div>
  );
};
