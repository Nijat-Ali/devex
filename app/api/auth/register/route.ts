import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, role, github, linkedin, bio, title, company, years, domains, skills } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { data: existing } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).maybeSingle();
  if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const { data: user, error } = await supabase.from("users").insert({
    name: name.trim(), email: email.toLowerCase().trim(), password, role,
    github: github || "", linkedin: linkedin || "", bio: bio || "",
    title: title || "", company: company || "", years: years || 0,
    domains: domains || [], skills: skills || [],
    verified_status: role === "expert" ? "pending" : "n/a",
  }).select().single();

  if (error || !user) return NextResponse.json({ error: error?.message || "Failed" }, { status: 500 });

  const token = await createSession(user);
  const res = NextResponse.json({ user });
  res.cookies.set("dx_session", token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/",
  });
  return res;
}
