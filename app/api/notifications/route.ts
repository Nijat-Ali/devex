import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([]);
  const { data } = await supabase.from("notifications")
    .select("*").eq("user_id", session.id).order("at", { ascending: false }).limit(20);
  return NextResponse.json(data || []);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await supabase.from("notifications").update({ read: true })
    .eq("user_id", session.id).eq("read", false);
  return NextResponse.json({ ok: true });
}
