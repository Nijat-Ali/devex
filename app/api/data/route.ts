import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const [users, assignments, purchases, sessions, submissions, reviews, endorsements, notifications] =
    await Promise.all([
      supabase.from("users").select("id,name,email,role,github,linkedin,bio,title,company,years,domains,skills,verified_status,created_at").order("created_at"),
      supabase.from("assignments").select("*").order("created_at", { ascending: false }),
      supabase.from("purchases").select("*"),
      supabase.from("sessions").select("*"),
      supabase.from("submissions").select("*").order("submitted_at", { ascending: false }),
      supabase.from("reviews").select("*"),
      supabase.from("endorsements").select("*").order("created_at", { ascending: false }),
      supabase.from("notifications").select("*").order("at", { ascending: false }),
    ]);

  return NextResponse.json({
    users: users.data || [],
    assignments: assignments.data || [],
    purchases: purchases.data || [],
    sessions: sessions.data || [],
    submissions: submissions.data || [],
    reviews: reviews.data || [],
    endorsements: endorsements.data || [],
    notifications: notifications.data || [],
  });
}
