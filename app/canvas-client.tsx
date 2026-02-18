"use client";

import { useState } from "react";
import type { CanvasElement, Comment } from "@/lib/db";
import { Nav } from "./components/nav";
import { DarkModeToggle } from "./components/dark-mode-toggle";
import { CanvasElement as CanvasElementCmp } from "./components/canvas-element";
import { StickyNote } from "./components/sticky-note";
import { Lightbox } from "./components/lightbox";
import { Scrap } from "./components/scrap";
import { CommentForm } from "./components/comment-form";

interface CanvasClientProps {
  elements: CanvasElement[];
  comments: Comment[];
}

export const CanvasClient = ({
  elements,
  comments,
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
        <span className="font-note">ZURI</span>
      </Scrap>

      {elements.map((el) => (
        <CanvasElementCmp
          key={el.id}
          element={el}
          onVideoClick={() => setLightboxOpen(true)}
        />
      ))}

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

      <Lightbox isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </div>
  );
};
