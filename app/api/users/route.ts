import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...updates } = await req.json();
  // Users can only update themselves; admins can update anyone
  if (session.role !== "admin" && session.id !== id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const allowed = ["bio","github","linkedin","avatar_url","title","company","years","skills","domains","verified_status","name"];
  const safe = Object.fromEntries(Object.entries(updates).filter(([k]) => allowed.includes(k)));
  const { data, error } = await supabase.from("users").update(safe).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
