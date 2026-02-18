import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAdmin } from "@/lib/auth";
import { AdminPanel } from "./admin-panel";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || !isAllowedAdmin(user.email)) {
    redirect("/admin/login");
  }
  return <AdminPanel />;
}
