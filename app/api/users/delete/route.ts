import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (id === session.id) return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  // Delete cascade: notifications, sessions, submissions, purchases, endorsements, reviews, assignments
  await supabase.from("notifications").delete().eq("user_id", id);
  await supabase.from("endorsements").delete().or(`learner_id.eq.${id},expert_id.eq.${id}`);
  await supabase.from("reviews").delete().eq("expert_id", id);
  await supabase.from("submissions").delete().or(`learner_id.eq.${id},expert_id.eq.${id}`);
  await supabase.from("sessions").delete().eq("learner_id", id);
  await supabase.from("purchases").delete().eq("learner_id", id);
  await supabase.from("assignments").delete().eq("expert_id", id);
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
