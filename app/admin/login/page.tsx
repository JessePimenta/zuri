"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Full page redirect so the next request includes the session cookies
    // set by Supabase; router.push + refresh can run before cookies are sent.
    window.location.href = "/admin";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        padding: 24,
      }}
    >
      <h1 className="font-tag" style={{ fontSize: "2rem" }}>
        Admin Login
      </h1>
      <form
        onSubmit={handleLogin}
        className="admin-card"
        style={{ width: 320 }}
      >
        <div className="admin-form-group">
          <label className="admin-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="admin-input"
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="admin-input"
          />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <div className="admin-form-actions" style={{ marginTop: 20 }}>
          <button
            type="submit"
            disabled={loading}
            className="admin-btn admin-btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? "..." : "Log in"}
          </button>
        </div>
      </form>
      <Link href="/" className="nav-link font-ui">
        ← Back to site
      </Link>
    </div>
  );
}
