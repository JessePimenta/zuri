"use client";

import { useRef } from "react";
import type { Transform } from "@/lib/db";

const MIN_SCALE = 0.5;
const MAX_SCALE = 2;

interface ResizeHandleProps {
  elementId: string;
  transform: Transform;
  onResizePreview: (partial: Partial<Transform>) => void;
  onResizeEnd: (partial: Partial<Transform>) => void;
}

const RESIZE_ICON = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M8 20V8" />
    <path d="M8 20h12" />
  </svg>
);

export const ResizeHandle = ({
  elementId,
  transform,
  onResizePreview,
  onResizeEnd,
}: ResizeHandleProps) => {
  const dragRef = useRef<{
    baseX: number;
    baseY: number;
    baseW: number;
    baseH: number;
    d0: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById(elementId);
    const container = document.querySelector(".canvas-container");
    if (!el || !container) return;
    const elRect = el.getBoundingClientRect();
    const contRect = container.getBoundingClientRect();
    const baseX = elRect.left - contRect.left;
    const baseY = elRect.top - contRect.top;
    const baseW = elRect.width;
    const baseH = elRect.height;
    const centerX = baseX + baseW / 2;
    const centerY = baseY + baseH / 2;
    const d0 = 0.5 * Math.sqrt(baseW * baseW + baseH * baseH);
    if (d0 <= 0) return;
    dragRef.current = { baseX, baseY, baseW, baseH, d0, centerX, centerY };

    const onMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current) return;
      const containerNow = document.querySelector(".canvas-container")?.getBoundingClientRect();
      if (!containerNow) return;
      const { baseX: bx, baseY: by, baseW: bw, baseH: bh, d0: refD } = dragRef.current;
      const mx = moveEvent.clientX - containerNow.left;
      const my = moveEvent.clientY - containerNow.top;
      const cx = bx + bw / 2;
      const cy = by + bh / 2;
      const d = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, d / refD));
      const newW = bw * scale;
      const newH = bh * scale;
      const newX = bx + bw - newW;
      const newY = by + bh - newH;
      onResizePreview({ ...transform, x: newX, y: newY, w: newW, h: newH });
    };

    const onUp = (upEvent: MouseEvent) => {
      if (!dragRef.current) return;
      const containerNow = document.querySelector(".canvas-container")?.getBoundingClientRect();
      if (!containerNow) return;
      const { baseX: bx, baseY: by, baseW: bw, baseH: bh, d0: refD } = dragRef.current;
      const mx = upEvent.clientX - containerNow.left;
      const my = upEvent.clientY - containerNow.top;
      const cx = bx + bw / 2;
      const cy = by + bh / 2;
      const d = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2);
      const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, d / refD));
      const newW = bw * scale;
      const newH = bh * scale;
      const newX = bx + bw - newW;
      const newY = by + bh - newH;
      onResizeEnd({ ...transform, x: newX, y: newY, w: newW, h: newH });
      dragRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  return (
    <div
      role="slider"
      aria-label="Resize"
      tabIndex={0}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        left: -8,
        bottom: -8,
        zIndex: 1001,
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#18181b",
        color: "#fff",
        borderRadius: 4,
        cursor: "nwse-resize",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      {RESIZE_ICON}
    </div>
  );
};
