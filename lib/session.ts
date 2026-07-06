import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || "devex-fallback-secret-change-in-prod"
);

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  verified_status?: string;
  title?: string;
  company?: string;
  years?: number;
  bio?: string;
  github?: string;
  linkedin?: string;
  domains?: string[];
  skills?: string[];
}

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("dx_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret);
    return (payload as any).user as SessionUser;
  } catch {
    return null;
  }
}
