import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

  const { data: user } = await supabase.from("users").select("*")
    .eq("email", email.toLowerCase().trim()).eq("password", password).single();

  if (!user) return NextResponse.json({ error: "Incorrect email or password" }, { status: 401 });

  const token = await createSession(user);
  const res = NextResponse.json({ user });
  res.cookies.set("dx_session", token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/",
  });
  return res;
}
