"use client";

import type { CanvasElement, Comment } from "@/lib/db";
import { CanvasView } from "./components/canvas-view";

interface CanvasClientProps {
  elements: CanvasElement[];
  comments: Comment[];
}

export const CanvasClient = ({
  elements,
  comments,
}: CanvasClientProps) => (
  <CanvasView
    elements={elements}
    isAdmin={false}
    comments={comments}
  />
);
