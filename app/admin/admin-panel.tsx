"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { CanvasElement, SiteState } from "@/lib/db";
import { CanvasElement as CanvasElementCmp } from "../components/canvas-element";
import { Nav } from "../components/nav";
import { Scrap } from "../components/scrap";
import { UploadAndAddForm } from "./upload-form";
import Link from "next/link";

export const AdminPanel = () => {
  const router = useRouter();
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [siteState, setSiteState] = useState<SiteState | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchData = async () => {
    const res = await fetch("/api/admin/elements");
    if (res.status === 401) {
      router.push("/admin/login");
      return;
    }
    const data = await res.json();
    setElements(data.elements ?? []);
    setSiteState(data.siteState ?? null);
    setAdminNote(data.siteState?.admin_note ?? "");
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

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this element?")) return;
    await fetch("/api/admin/elements", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  const handleSaveAdminNote = async () => {
    await fetch("/api/admin/site-state", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_note: adminNote || null }),
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
            onClick={() => setShowAddForm(!showAddForm)}
            className="admin-btn admin-btn-primary"
          >
            {showAddForm ? "Cancel" : "+ Add element"}
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

      {showAddForm && (
        <UploadAndAddForm
          onSuccess={() => {
            setShowAddForm(false);
            void fetchData();
          }}
        />
      )}

      <div className="admin-card" style={{ maxWidth: 480 }}>
        <div className="admin-form-group" style={{ marginBottom: 12 }}>
          <label className="admin-label">
            Admin note (shown on homepage)
          </label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            rows={3}
            className="admin-textarea"
          />
        </div>
        <div className="admin-form-actions">
          <button
            type="button"
            onClick={handleSaveAdminNote}
            className="admin-btn admin-btn-primary"
          >
            Save note
          </button>
        </div>
      </div>

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
          ZURI
        </Scrap>
        {elements.map((el) => (
          <CanvasElementCmp
            key={el.id}
            element={el}
            isAdmin
            onTransformUpdate={handleTransformUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
