"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const CommentForm = () => {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase
      .from("comments")
      .insert({ body: body.trim(), status: "approved" });
    if (error) {
      setStatus("error");
      return;
    }
    setBody("");
    setStatus("success");
    router.refresh();
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
      }}
    >
      <input
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Leave a comment..."
        className="font-ui"
        disabled={status === "loading"}
        style={{
          padding: "8px 12px",
          width: 200,
          border: "1px solid #ccc",
          background: "white",
          fontSize: 12,
        }}
      />
      <button
        type="submit"
        className="font-ui"
        disabled={status === "loading"}
        style={{
          padding: "8px 12px",
          border: "1px solid #333",
          background: "#333",
          color: "white",
          cursor: status === "loading" ? "wait" : "pointer",
          fontSize: 12,
        }}
      >
        {status === "loading" ? "..." : status === "success" ? "✓" : "Post"}
      </button>
    </form>
  );
};
