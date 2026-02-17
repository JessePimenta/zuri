import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateSiteState } from "@/lib/db";

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "<MY_EMAIL_PLACEHOLDER>";

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  await updateSiteState(supabase, body.admin_note ?? null);
  return NextResponse.json({ ok: true });
}
