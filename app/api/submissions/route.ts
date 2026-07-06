import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { data, error } = await supabase.from("submissions").insert({
    assignment_id: body.assignment_id, learner_id: session.id, expert_id: body.expert_id,
    purchase_id: body.purchase_id, session_id: body.session_id,
    github_repo_url: body.github_repo_url, live_demo_url: body.live_demo_url || "",
    written_explanation: body.written_explanation || "", status: "pending_review",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("notifications").insert({
    user_id: body.expert_id, type: "submission", title: "New submission received",
    message: `${session.name} submitted work for "${body.assignment_title}"`,
  });

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...updates } = await req.json();
  const { data, error } = await supabase.from("submissions").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
