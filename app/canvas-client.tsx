"use client";

import { useState } from "react";
import type { CanvasElement, Comment } from "@/lib/db";
import { Nav } from "./components/nav";
import { DarkModeToggle } from "./components/dark-mode-toggle";
import { CanvasElement as CanvasElementCmp } from "./components/canvas-element";
import { StickyNote } from "./components/sticky-note";
import { AdminNote } from "./components/admin-note";
import { Lightbox } from "./components/lightbox";
import { Scrap } from "./components/scrap";
import { CommentForm } from "./components/comment-form";
import { createClient } from "@/lib/supabase/client";

interface CanvasClientProps {
  elements: CanvasElement[];
  comments: Comment[];
  adminNote: string | null;
}

export const CanvasClient = ({
  elements,
  comments,
  adminNote,
}: CanvasClientProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <div className="canvas-container">
      <Nav />
      <DarkModeToggle />

      <Scrap
        id="main-tag"
        className="font-tag"
        style={{
          top: 40,
          right: 50,
          fontSize: "5rem",
          opacity: 0.1,
          pointerEvents: "none",
        }}
        draggable={false}
      >
        ZURI
      </Scrap>

      {elements.map((el) => (
        <CanvasElementCmp
          key={el.id}
          element={el}
          onVideoClick={() => setLightboxOpen(true)}
        />
      ))}

      {adminNote && (
        <Scrap
          id="admin-note"
          style={{ top: 120, left: 50, transform: "rotate(-3deg)", zIndex: 20 }}
          isNote
        >
          <AdminNote>{adminNote}</AdminNote>
        </Scrap>
      )}

      <Scrap
        id="note-1"
        className="testimonial-bar"
        style={{ bottom: "2rem", left: "2rem", transform: "rotate(-4deg)" }}
        isNote
      >
        <StickyNote comments={comments} />
      </Scrap>

      <CommentForm />

      <Lightbox isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
};
