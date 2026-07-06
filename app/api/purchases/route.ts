import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "learner") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();

  // Check already purchased
  const { data: existing } = await supabase.from("purchases")
    .select("id").eq("learner_id", session.id).eq("assignment_id", body.assignment_id).maybeSingle();
  if (existing) return NextResponse.json({ error: "Already purchased" }, { status: 409 });

  const price = parseFloat(body.price);
  const { data, error } = await supabase.from("purchases").insert({
    assignment_id: body.assignment_id,
    learner_id: session.id,
    amount_paid: price,
    platform_commission: +(price * 0.2).toFixed(2),
    expert_earnings: +(price * 0.8).toFixed(2),
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Increment sales count
  await supabase.from("assignments")
    .update({ sales_count: (body.current_sales || 0) + 1 })
    .eq("id", body.assignment_id);

  // Notify expert
  await supabase.from("notifications").insert({
    user_id: body.expert_id, type: "sale", title: "New assignment sale",
    message: `${session.name} purchased "${body.title}"`,
  });

  return NextResponse.json(data);
}
