import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "expert") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { submission_id, scores, feedback, strengths, revision_notes, decision, endorsement_text,
    learner_id, assignment_id, assignment_title, skills } = body;

  // Calculate overall score
  const vals = Object.values(scores as Record<string, number>).map(Number);
  const overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;

  // Create review
  const { error: reviewErr } = await supabase.from("reviews").insert({
    submission_id, expert_id: session.id, scores, overall_score: overall,
    feedback, strengths: strengths || "", revision_notes: revision_notes || "", decision,
  });
  if (reviewErr) return NextResponse.json({ error: reviewErr.message }, { status: 500 });

  // Update submission status
  const status = decision === "endorse" ? "endorsed" : decision === "revision" ? "revision_requested" : "rejected";
  await supabase.from("submissions").update({ status, final_score: overall }).eq("id", submission_id);

  // If endorsing, create endorsement record
  if (decision === "endorse" && endorsement_text) {
    await supabase.from("endorsements").insert({
      learner_id, expert_id: session.id, assignment_id, submission_id,
      score: overall, text: endorsement_text, skills: skills || [],
    });
    await supabase.from("notifications").insert({
      user_id: learner_id, type: "endorsement",
      title: "🏅 You've been endorsed!",
      message: `${session.name} endorsed your work for "${assignment_title}"`,
    });
  } else {
    await supabase.from("notifications").insert({
      user_id: learner_id, type: "review",
      title: "Review received",
      message: `${session.name} reviewed your submission for "${assignment_title}"`,
    });
  }

  return NextResponse.json({ ok: true, overall_score: overall });
}
