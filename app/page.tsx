import { createClient } from "@/lib/supabase/server";
import { getPublishedElements, getApprovedComments, getSiteState } from "@/lib/db";
import { CanvasClient } from "./canvas-client";

export default async function HomePage() {
  const supabase = await createClient();
  const [elements, comments, siteState] = await Promise.all([
    getPublishedElements(supabase),
    getApprovedComments(supabase),
    getSiteState(supabase),
  ]);

  return (
    <CanvasClient
      elements={elements}
      comments={comments}
      adminNote={siteState?.admin_note ?? null}
    />
  );
}
