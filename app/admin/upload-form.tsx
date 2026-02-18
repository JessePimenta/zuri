"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

type ElementType = "image" | "video" | "text" | "link";

export const UploadAndAddForm = ({
  onSuccess,
}: {
  onSuccess: () => void;
}) => {
  const [type, setType] = useState<ElementType>("image");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [label, setLabel] = useState("");
  const [footerLabel, setFooterLabel] = useState("");
  const [tape, setTape] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const needsFile = type === "image" || type === "video";

  useEffect(() => {
    if (!file || !needsFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, needsFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (needsFile && !file) {
      setError("Select a file");
      return;
    }
    if (!needsFile && !content.trim()) {
      setError("Enter content");
      return;
    }
    setError("");
    setLoading(true);

    let finalContent = content;

    if (needsFile && file) {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${type}s/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false });
      if (uploadErr) {
        setError(uploadErr.message);
        setLoading(false);
        return;
      }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      finalContent = data.publicUrl;
    }

    const style: Record<string, unknown> = {};
    if (type === "image") {
      if (caption) style.caption = caption;
      if (tape) style.tape = true;
    } else if (type === "video") {
      if (label) style.label = label;
      if (footerLabel) style.footerLabel = footerLabel;
    } else if (type === "link" && caption) {
      style.caption = caption;
    }

    const res = await fetch("/api/admin/elements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        content: finalContent,
        transform: { x: 100, y: 100, rotate: 0, z: 10 },
        style,
        is_published: isPublished,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setError(err.error ?? "Failed to save element");
      setLoading(false);
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="admin-card">
      <h3 className="admin-label" style={{ marginBottom: 20 }}>
        Add element
      </h3>
      <div
        style={{
          display: "flex",
          gap: 0,
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: "0 0 320px" }}>
        <div className="admin-form-group">
          <span className="admin-label" style={{ marginBottom: 8, display: "block" }}>Type</span>
          <div className="admin-radio-row" role="radiogroup" aria-label="Element type">
            {(["image", "video", "text", "link"] as const).map((value) => (
              <label key={value} className="admin-radio-option">
                <input
                  type="radio"
                  name="element-type"
                  value={value}
                  checked={type === value}
                  onChange={() => {
                    setType(value);
                    setFile(null);
                  }}
                />
                <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
              </label>
            ))}
          </div>
        </div>
        {needsFile && (
          <div className="admin-form-group">
            <label className="admin-label">File</label>
            <input
              type="file"
              accept={type === "image" ? "image/*" : "video/*"}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="admin-input"
            />
          </div>
        )}
        {(type === "text" || type === "link") && (
          <div className="admin-form-group">
            <label className="admin-label">
              {type === "text" ? "Text content" : "URL"}
            </label>
            <input
              type={type === "link" ? "url" : "text"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={type === "link" ? "https://..." : "Your text..."}
              className="admin-input"
            />
          </div>
        )}
        {type === "link" && (
          <div className="admin-form-group">
            <label className="admin-label">Label (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Link text"
              className="admin-input"
            />
          </div>
        )}
        {type === "image" && (
          <>
            <div className="admin-form-group">
              <label className="admin-label">Caption</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Dust & Light"
                className="admin-input"
              />
            </div>
            <div className="admin-checkbox-row">
              <input
                type="checkbox"
                id="tape"
                checked={tape}
                onChange={(e) => setTape(e.target.checked)}
              />
              <label htmlFor="tape" className="admin-label" style={{ margin: 0, textTransform: "none" }}>
                Tape
              </label>
            </div>
          </>
        )}
        {type === "video" && (
          <>
            <div className="admin-form-group">
              <label className="admin-label">Play label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="PLAY_REC_01.MOV"
                className="admin-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Footer label</label>
              <input
                type="text"
                value={footerLabel}
                onChange={(e) => setFooterLabel(e.target.value)}
                placeholder="STUDY_TEXTURE_01"
                className="admin-input"
              />
            </div>
          </>
        )}
        <div className="admin-checkbox-row">
          <input
            type="checkbox"
            id="published"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          <label htmlFor="published" className="admin-label" style={{ margin: 0, textTransform: "none" }}>
            Published (visible on site)
          </label>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-actions">
          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
          >
            {loading ? (needsFile ? "Uploading..." : "Adding...") : "Add"}
          </button>
        </div>
        </div>

        {needsFile && (
          <div
            className="admin-preview-thumbnail"
            style={{
              flex: 1,
              minWidth: 140,
              minHeight: 400,
              maxWidth: 400,
              aspectRatio: "4/3",
              background: "#f4f4f5",
              borderRadius: 4,
              border: "1px solid #e4e4e7",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {previewUrl ? (
              type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <video
                  src={previewUrl}
                  muted
                  playsInline
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              )
            ) : (
              <span
                className="admin-label"
                style={{ color: "#a1a1aa", textTransform: "none" }}
              >
                Select a file to preview
              </span>
            )}
          </div>
        )}
      </div>
    </form>
  );
};
