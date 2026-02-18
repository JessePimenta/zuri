"use client";

interface ElementEditorProps {
  elementId: string;
  rotate?: number;
  onRotateChange?: (degrees: number) => void;
  onDelete?: (id: string) => void;
}

export const ElementEditor = ({
  elementId,
  rotate = 0,
  onRotateChange,
  onDelete,
}: ElementEditorProps) => (
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
    {onRotateChange != null && (
      <label
        className="font-ui"
        style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}
      >
        <span style={{ whiteSpace: "nowrap" }}>°</span>
        <input
          type="number"
          step="any"
          value={rotate}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "" || v === "-") return;
            const n = Number(v);
            if (!Number.isNaN(n)) onRotateChange(n);
          }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 52,
            padding: "2px 4px",
            fontSize: 10,
            border: "1px solid #d4d4d8",
            borderRadius: 4,
          }}
          aria-label="Rotation (degrees)"
        />
      </label>
    )}
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
