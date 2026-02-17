import { createClient } from "@/lib/supabase/server";
import { getPublishedElements, getApprovedComments } from "@/lib/db";
import { CanvasClient } from "./canvas-client";

export default async function HomePage() {
  const supabase = await createClient();
  const [elements, comments] = await Promise.all([
    getPublishedElements(supabase),
    getApprovedComments(supabase),
  ]);

  return (
    <CanvasClient
      elements={elements}
      comments={comments}
    />
  );
}
