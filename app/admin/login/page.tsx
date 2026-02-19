"use client";

import { useState } from "react";
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
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (res.redirected || res.status === 302 || res.status === 307) {
        window.location.href = "/admin";
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
    } finally {
      setLoading(false);
    }
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
