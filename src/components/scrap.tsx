import { useCallback, useEffect, useRef, type ReactNode } from "react";

interface ScrapProps {
  id: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  draggable?: boolean;
  isNote?: boolean;
}

export const Scrap = ({
  id,
  children,
  className = "",
  style = {},
  draggable = true,
  isNote = false,
}: ScrapProps) => {
  const elRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!draggable || id === "main-tag") return;
      if ((e.target as HTMLElement).closest("button")) return;
      draggedRef.current = elRef.current;
      if (!elRef.current) return;
      const rect = elRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      elRef.current.style.transition = "none";
      elRef.current.style.zIndex = "1000";
    },
    [id, draggable]
  );

  const handleMouseEnter = useCallback(() => {
    if (elRef.current) elRef.current.style.zIndex = "100";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (elRef.current) {
      elRef.current.style.zIndex = isNote ? "15" : "10";
    }
  }, [isNote]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedRef.current) return;
      const container = document.querySelector(".canvas-container");
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const newLeft = e.clientX - rect.left - offsetRef.current.x;
      const newTop = e.clientY - rect.top - offsetRef.current.y;
      draggedRef.current.style.left = `${newLeft}px`;
      draggedRef.current.style.top = `${newTop}px`;
    };

    const handleMouseUp = () => {
      if (draggedRef.current) {
        draggedRef.current.style.transition =
          "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)";
        draggedRef.current.style.zIndex = isNote ? "15" : "10";
        draggedRef.current = null;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isNote]);

  return (
    <div
      ref={elRef}
      id={id}
      className={`scrap ${className}`}
      style={style}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};
