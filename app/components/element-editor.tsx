"use client";

interface ElementEditorProps {
  elementId: string;
  onDelete?: (id: string) => void;
}

const TRASH_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

export const ElementEditor = ({ elementId, onDelete }: ElementEditorProps) => (
  <div
    style={{
      position: "absolute",
      right: 36,
      bottom: -8,
      zIndex: 1001,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onMouseDown={(e) => e.stopPropagation()}
  >
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete?.(elementId);
      }}
      className="element-editor-trash"
      aria-label="Delete element"
      style={{
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        background: "#18181b",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}
    >
      {TRASH_ICON}
    </button>
  </div>
);
