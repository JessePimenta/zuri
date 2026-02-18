"use client";

import { useRef } from "react";

interface RotateHandleProps {
  elementId: string;
  rotate: number;
  onRotatePreview: (degrees: number) => void;
  onRotateEnd: (degrees: number) => void;
}

const ROTATE_ICON = (
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
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

export const RotateHandle = ({
  elementId,
  rotate,
  onRotatePreview,
  onRotateEnd,
}: RotateHandleProps) => {
  const dragRef = useRef<{
    centerX: number;
    centerY: number;
    startRotate: number;
    startAngle: number;
  } | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById(elementId);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const centerX = r.left + r.width / 2;
    const centerY = r.top + r.height / 2;
    const startAngle = Math.atan2(
      e.clientY - centerY,
      e.clientX - centerX
    );
    dragRef.current = {
      centerX,
      centerY,
      startRotate: rotate,
      startAngle,
    };

    const onMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current) return;
      const { centerX: cx, centerY: cy, startRotate, startAngle } = dragRef.current;
      const angle = Math.atan2(moveEvent.clientY - cy, moveEvent.clientX - cx);
      const deltaDeg = ((angle - startAngle) * 180) / Math.PI;
      onRotatePreview(startRotate + deltaDeg);
    };

    const onUp = (upEvent: MouseEvent) => {
      if (!dragRef.current) return;
      const { centerX: cx, centerY: cy, startRotate, startAngle } = dragRef.current;
      const angle = Math.atan2(upEvent.clientY - cy, upEvent.clientX - cx);
      const deltaDeg = ((angle - startAngle) * 180) / Math.PI;
      const finalRotate = startRotate + deltaDeg;
      onRotateEnd(finalRotate);
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
      aria-label="Rotate"
      aria-valuenow={Math.round(rotate)}
      tabIndex={0}
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        right: -8,
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
        cursor: "grab",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      {ROTATE_ICON}
    </div>
  );
};
