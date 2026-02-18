"use client";

interface ElementEditorProps {
  elementId: string;
  onDelete?: (id: string) => void;
}

export const ElementEditor = ({ elementId, onDelete }: ElementEditorProps) => (
  <div
    style={{
      position: "absolute",
      top: -8,
      right: -8,
      zIndex: 1001,
      display: "flex",
      gap: 4,
      alignItems: "center",
    }}
    onMouseDown={(e) => e.stopPropagation()}
  >
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete?.(elementId);
      }}
      className="font-ui"
      style={{
        padding: "4px 8px",
        background: "#c00",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontSize: 10,
      }}
    >
      Delete
    </button>
  </div>
);
