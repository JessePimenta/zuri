"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CanvasElement } from "@/lib/db";
import { CanvasElement as CanvasElementCmp } from "../components/canvas-element";
import { Nav } from "../components/nav";
import { Scrap } from "../components/scrap";
import { UploadAndAddForm } from "./upload-form";
import Link from "next/link";

export const AdminPanel = () => {
  const router = useRouter();
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftRotate, setDraftRotate] = useState<Record<string, number>>({});
  const [draftResize, setDraftResize] = useState<Record<string, Record<string, unknown>>>({});

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

  const handleResizePreview = (id: string, partial: Record<string, unknown>) => {
    setDraftResize((prev) => ({ ...prev, [id]: partial }));
  };

  const handleResizeEnd = async (id: string, partial: Record<string, unknown>) => {
    setDraftResize((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await handleTransformUpdate(id, partial);
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

  if (loading) {
    return (
      <div className="admin-page" style={{ padding: 48, textAlign: "center", color: "#71717a" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="font-tag" style={{ fontSize: "1.5rem" }}>
          Admin Panel
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn admin-btn-secondary"
            style={{ textDecoration: "none" }}
          >
            View site
          </Link>
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

      <div className="canvas-container admin-canvas-preview">
        <Nav />
        <Scrap
          id="main-tag"
          className="font-tag"
          style={{
            top: 40,
            right: 50,
            fontSize: "5rem",
            opacity: 0.1,
            pointerEvents: "none",
          }}
          draggable={false}
        >
          <span className="font-note" style={{ fontSize: "3.75rem" }}>ZURI</span>
        </Scrap>
        {elements.map((el) => (
          <CanvasElementCmp
            key={el.id}
            element={el}
            isAdmin
            draftRotate={draftRotate[el.id]}
            draftResize={draftResize[el.id]}
            onTransformUpdate={handleTransformUpdate}
            onRotatePreview={handleRotatePreview}
            onRotateEnd={handleRotateEnd}
            onResizePreview={handleResizePreview}
            onResizeEnd={handleResizeEnd}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
