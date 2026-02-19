"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CanvasElement } from "@/lib/db";
import { CanvasView } from "../components/canvas-view";
import { UploadAndAddForm } from "./upload-form";

export const AdminPanel = () => {
  const router = useRouter();
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewAsVisitor, setPreviewAsVisitor] = useState(false);
  const [draftRotate, setDraftRotate] = useState<Record<string, number>>({});

  const fetchData = async () => {
    const res = await fetch("/api/admin/elements");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setElements(data.elements ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransformUpdate = async (
    id: string,
    transform: Record<string, unknown>
  ) => {
    await fetch("/api/admin/elements", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, transform }),
    });
    fetchData();
  };

  const handleRotatePreview = (id: string, degrees: number) => {
    setDraftRotate((prev) => ({ ...prev, [id]: degrees }));
  };

  const handleRotateEnd = async (id: string, degrees: number) => {
    setDraftRotate((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    await handleTransformUpdate(id, { ...el.transform, rotate: degrees });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this element?")) return;
    await fetch("/api/admin/elements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const displayElements = previewAsVisitor
    ? elements.filter((el) => el.is_published)
    : elements;

  if (loading) {
    return (
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-header">
            <h1 className="font-tag" style={{ fontSize: "1.5rem" }}>Admin Panel</h1>
          </div>
          <p style={{ padding: 24, color: "#71717a", fontSize: 14 }}>Loading...</p>
        </aside>
        <main className="admin-preview" />
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {!previewAsVisitor && (
        <aside className="admin-sidebar">
          <div className="admin-header">
            <h1 className="font-tag" style={{ fontSize: "1.5rem" }}>
              Admin Panel
            </h1>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setPreviewAsVisitor(true)}
                className="admin-btn admin-btn-secondary"
              >
                View as visitor
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="admin-btn admin-btn-secondary"
              >
                Sign out
              </button>
            </div>
          </div>
          <UploadAndAddForm onSuccess={() => void fetchData()} />
        </aside>
      )}
      {previewAsVisitor && (
        <div
          className="admin-preview-banner"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: "10px 20px",
            background: "#18181b",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontFamily: "Inter",
            fontSize: 14,
          }}
        >
          <span>Previewing as visitor</span>
          <button
            type="button"
            onClick={() => setPreviewAsVisitor(false)}
            className="admin-btn admin-btn-primary"
            style={{ padding: "6px 12px", fontSize: 12 }}
          >
            Exit preview
          </button>
        </div>
      )}
      <main className="admin-preview" style={{ paddingTop: previewAsVisitor ? 52 : 0 }}>
        <CanvasView
          elements={displayElements}
          isAdmin={!previewAsVisitor}
          draftRotate={draftRotate}
          onTransformUpdate={handleTransformUpdate}
          onRotatePreview={handleRotatePreview}
          onRotateEnd={handleRotateEnd}
          onDelete={handleDelete}
          containerClassName={!previewAsVisitor ? "admin-canvas-preview" : undefined}
        />
      </main>
    </div>
  );
};
