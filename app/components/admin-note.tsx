import type { ReactNode } from "react";

interface AdminNoteProps {
  children: ReactNode;
}

export const AdminNote = ({ children }: AdminNoteProps) => (
  <article className="admin-note">
    <p className="font-note" style={{ color: "#1a1a1a", fontSize: "1.6rem" }}>
      {children}
    </p>
  </article>
);
