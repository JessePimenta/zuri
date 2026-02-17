import type { SupabaseClient } from "@supabase/supabase-js";

export type CanvasElementType = "image" | "video" | "youtube" | "text" | "link";

export interface Transform {
  x?: number;
  y?: number;
  w?: number | null;
  h?: number | null;
  rotate?: number;
  z?: number;
}

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  content: string;
  transform: Transform;
  style: Record<string, unknown>;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  body: string;
  created_at: string;
  status: string;
}

export interface SiteState {
  id: number;
  admin_note: string | null;
  updated_at: string;
}

export async function getPublishedElements(
  supabase: SupabaseClient
): Promise<CanvasElement[]> {
  const { data, error } = await supabase
    .from("canvas_elements")
    .select("*")
    .eq("is_published", true)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CanvasElement[];
}

export async function getApprovedComments(
  supabase: SupabaseClient
): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("id, body, created_at, status")
    .eq("status", "approved")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Comment[];
}

export async function getSiteState(
  supabase: SupabaseClient
): Promise<SiteState | null> {
  const { data, error } = await supabase
    .from("site_state")
    .select("*")
    .eq("id", 1)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data as SiteState | null;
}

// Admin-only (requires authenticated admin user)
export async function getAllElements(
  supabase: SupabaseClient
): Promise<CanvasElement[]> {
  const { data, error } = await supabase
    .from("canvas_elements")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CanvasElement[];
}

export async function insertElement(
  supabase: SupabaseClient,
  element: Omit<CanvasElement, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("canvas_elements")
    .insert(element)
    .select("id")
    .single();
  if (error) throw error;
  return data.id;
}

export async function updateElement(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Pick<CanvasElement, "type" | "content" | "transform" | "style" | "is_published">>
) {
  const { error } = await supabase
    .from("canvas_elements")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteElement(
  supabase: SupabaseClient,
  id: string
) {
  const { error } = await supabase
    .from("canvas_elements")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function updateSiteState(
  supabase: SupabaseClient,
  adminNote: string | null
) {
  const { error } = await supabase
    .from("site_state")
    .update({ admin_note: adminNote, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw error;
}
