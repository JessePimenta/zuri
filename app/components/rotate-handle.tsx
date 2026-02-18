"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface RotateHandleProps {
  elementId: string;
  rotate: number;
  onRotateChange: (degrees: number) => void;
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
  onRotateChange,
}: RotateHandleProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const startRef = useRef({ rotate: 0, angle: 0 });

  const getCenter = useCallback(() => {
    const el = document.getElementById(elementId);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, [elementId]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const center = getCenter();
      if (!center) return;
      const angle = Math.atan2(
        e.clientY - center.y,
        e.clientX - center.x
      );
      startRef.current = { rotate, angle };
      setIsDragging(true);
    },
    [getCenter, rotate]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const center = getCenter();
      if (!center) return;
      const currentAngle = Math.atan2(
        e.clientY - center.y,
        e.clientX - center.x
      );
      const deltaDeg =
        ((currentAngle - startRef.current.angle) * 180) / Math.PI;
      const newRotate = startRef.current.rotate + deltaDeg;
      onRotateChange(newRotate);
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, getCenter, onRotateChange]);

  return (
    <div
      role="slider"
      aria-label="Rotate"
      aria-valuenow={Math.round(rotate)}
      tabIndex={0}
      onMouseDown={handleMouseDown}
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
        cursor: isDragging ? "grabbing" : "grab",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      {ROTATE_ICON}
    </div>
  );
};
