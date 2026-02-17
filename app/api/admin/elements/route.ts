import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getAllElements,
  insertElement,
  updateElement,
  deleteElement,
} from "@/lib/db";

const ADMIN_EMAIL =
  process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "<MY_EMAIL_PLACEHOLDER>";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return { error: "Unauthorized", supabase: null };
  }
  return { error: null, supabase };
}

export async function GET() {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const elements = await getAllElements(supabase);
  return NextResponse.json({ elements });
}

export async function POST(req: Request) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const id = await insertElement(supabase, {
    type: body.type,
    content: body.content,
    transform: body.transform ?? { x: 0, y: 0, rotate: 0, z: 10 },
    style: body.style ?? {},
    is_published: body.is_published ?? false,
  });
  return NextResponse.json({ id });
}

export async function PATCH(req: Request) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { id, transform, ...rest } = body;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const updates: Record<string, unknown> = { ...rest };
  if (transform) updates.transform = transform;
  await updateElement(supabase, id, updates);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { error, supabase } = await requireAdmin();
  if (error || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await deleteElement(supabase, body.id);
  return NextResponse.json({ ok: true });
}
