import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });
  const { data: user } = await supabase.from("users").select("*").eq("id", session.id).single();
  return NextResponse.json({ user: user || null });
}
