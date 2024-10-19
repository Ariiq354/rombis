import { sha256 } from "@oslojs/crypto/sha2";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import type { H3Event } from "h3";
import type { Session, UserLucia } from "../database/schema/auth";
import {
  deleteSessionData,
  getUserSessionById,
  insertSessionData,
  updateSessionData,
} from "./data-access/session";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: string
): Promise<Omit<Session, "createdAt" | "updatedAt">> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * SESSION_AGE),
  };
  await insertSessionData(session);
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await getUserSessionById(sessionId);
  if (result.length < 1) {
    return { session: null, user: null };
  }
  const { user, session } = result[0];
  if (Date.now() >= session.expiresAt.getTime()) {
    await deleteSessionData(session.id);
    return { session: null, user: null };
  }
  if (
    Date.now() >=
    session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * (SESSION_AGE / 2)
  ) {
    session.expiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * SESSION_AGE
    );
    await updateSessionData(session.id, session);
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await deleteSessionData(sessionId);
}

export function setSessionTokenCookie(
  event: H3Event,
  token: string,
  expiresAt: Date
) {
  setCookie(event, "auth_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

export function deleteSessionTokenCookie(event: H3Event) {
  deleteCookie(event, "auth_session");
}

export function verifyRequestOrigin(
  origin: string,
  allowedDomains: string[]
): boolean {
  if (!origin || allowedDomains.length === 0) {
    return false;
  }
  const originHost = safeURL(origin)?.host ?? null;
  if (!originHost) {
    return false;
  }
  for (const domain of allowedDomains) {
    let host: string | null;
    if (domain.startsWith("http://") || domain.startsWith("https://")) {
      host = safeURL(domain)?.host ?? null;
    } else {
      host = safeURL("https://" + domain)?.host ?? null;
    }
    if (originHost === host) {
      return true;
    }
  }
  return false;
}

function safeURL(url: URL | string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export function generateIdFromEntropySize(size: number): string {
  const buffer = crypto.getRandomValues(new Uint8Array(size));
  return encodeBase32LowerCaseNoPadding(buffer);
}

export type SessionValidationResult =
  | { session: Session; user: UserLucia }
  | { session: null; user: null };

const SESSION_AGE = 1;
