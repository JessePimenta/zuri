export function getAllowedAdminEmails(): string[] {
  const list = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (list) return list.split(",").map((e) => e.trim()).filter(Boolean);
  const single = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  return single ? [single] : [];
}

export function isAllowedAdmin(email: string | undefined): boolean {
  if (!email) return false;
  const allowed = getAllowedAdminEmails();
  return allowed.length > 0 && allowed.includes(email);
}
