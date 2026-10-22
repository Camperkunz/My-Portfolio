/**
 * POST /api/contact — Vercel Serverless Function that delivers contact-form
 * submissions through Resend.
 *
 * Security notes:
 * - The Resend API key is read from the server environment only. It is never
 *   exposed to the browser (no VITE_ prefix, no direct client → Resend calls).
 * - Only same-origin browser requests are accepted unless an explicit
 *   CONTACT_ALLOWED_ORIGINS list is configured, so the endpoint cannot be
 *   abused as an open email relay.
 * - All user input is validated, length-limited and HTML-escaped before it is
 *   interpolated into the notification email.
 * - A honeypot field and a best-effort per-instance rate limit keep casual
 *   spam out without adding a database dependency.
 * - The client IP is used only for the in-memory rate limit. It is never
 *   written into the notification email, so no persistent PII is created
 *   beyond what the visitor chose to submit.
 */

import { Resend } from "resend";

/**
 * Minimal structural types for the Vercel Node.js request/response helpers.
 * Declaring them locally keeps the function free of the heavy `@vercel/node`
 * dev dependency while covering the exact surface used below.
 */
export interface ContactRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

export interface ContactResponse {
  status(code: number): ContactResponse;
  json(payload: unknown): void;
  setHeader(name: string, value: string): void;
  end(): void;
}

const REASONS = {
  job: "Job opportunity",
  freelance: "Freelance project",
  collaboration: "Collaboration",
  question: "General question",
  other: "Other",
} as const;

type ReasonKey = keyof typeof REASONS;

const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  message: { min: 10, max: 2000 },
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_PAYLOAD_BYTES = 16_384;
const MAX_IP_ENTRIES = 5000;

// Best-effort abuse protection. Serverless instances are short-lived and can
// scale horizontally, so this throttles casual spam per instance rather than
// acting as a hard global quota (that would require a shared store).
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);

  // Prune stale entries so the map cannot grow without bound.
  if (requestLog.size > MAX_IP_ENTRIES) {
    for (const [key, times] of requestLog) {
      const last = times[times.length - 1] ?? 0;
      if (now - last >= RATE_LIMIT_WINDOW_MS) requestLog.delete(key);
    }
  }

  return false;
}

function firstHeaderValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function getHeader(req: ContactRequest, name: string): string | undefined {
  return firstHeaderValue(req.headers[name]);
}

function getClientIp(req: ContactRequest): string {
  // `x-real-ip` is written by Vercel's edge network and cannot be spoofed by
  // the client; fall back to the first forwarded hop and then the socket.
  const realIp = getHeader(req, "x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwarded = getHeader(req, "x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
}

function isAllowedOrigin(req: ContactRequest): boolean {
  const origin = getHeader(req, "origin");
  // Non-browser clients (curl, server-to-server) do not send Origin.
  if (!origin) return true;

  const allowList = (process.env.CONTACT_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (allowList.length > 0) return allowList.includes(origin);

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const expectedHost = getHeader(req, "x-forwarded-host") ?? getHeader(req, "host");
  return Boolean(expectedHost) && originHost === expectedHost;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBody(body: unknown): Record<string, unknown> | null {
  if (body == null) return {};
  if (typeof body === "string") {
    if (body.length > MAX_PAYLOAD_BYTES) return null;
    try {
      const parsed: unknown = JSON.parse(body);
      return isRecord(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return isRecord(body) ? body : null;
}

function readString(payload: Record<string, unknown>, key: string): string {
  const value = payload[key];
  return typeof value === "string" ? value : "";
}

interface ContactData {
  name: string;
  email: string;
  reason: ReasonKey;
  message: string;
}

function validate(payload: Record<string, unknown>): { data?: ContactData; error?: string } {
  // Collapse whitespace (this also strips CR/LF, preventing header injection
  // when the name is used in the subject line).
  const name = readString(payload, "name").trim().replace(/\s+/g, " ");
  const email = readString(payload, "email").trim();
  const reason = readString(payload, "reason").trim();
  const message = readString(payload, "message")
    // Keep line breaks, drop other control characters.
    // eslint-disable-next-line no-control-regex -- stripping control characters is the intent
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) {
    return { error: `Please enter a name between ${LIMITS.name.min} and ${LIMITS.name.max} characters.` };
  }
  if (email.length > LIMITS.email.max || !EMAIL_PATTERN.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!Object.prototype.hasOwnProperty.call(REASONS, reason)) {
    return { error: "Please choose a reason for getting in touch." };
  }
  if (message.length < LIMITS.message.min) {
    return { error: `Please add a message of at least ${LIMITS.message.min} characters.` };
  }
  if (message.length > LIMITS.message.max) {
    return { error: `Please keep your message under ${LIMITS.message.max} characters.` };
  }

  return { data: { name, email, reason: reason as ReasonKey, message } };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmail(data: ContactData, meta: { userAgent: string }) {
  const reason = REASONS[data.reason];
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message);
  const safeReason = escapeHtml(reason);
  const sentAt = new Date().toISOString();
  const userAgent = meta.userAgent.slice(0, 200);

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background:#0b0b0b;font-family:Montserrat,Arial,sans-serif;color:#f5f5f5;">
    <div style="max-width:600px;margin:0 auto;background:#141414;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;">
      <div style="height:4px;background:#ef4444;"></div>
      <div style="padding:24px;">
        <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#ef4444;">Portfolio contact form</p>
        <h1 style="margin:0 0 20px;font-size:20px;line-height:1.3;color:#ffffff;">${safeReason}</h1>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:8px 0;color:#9a9a9a;width:110px;">Name</td>
            <td style="padding:8px 0;color:#f5f5f5;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#9a9a9a;">Email</td>
            <td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#ef4444;text-decoration:none;">${safeEmail}</a></td>
          </tr>
        </table>
        <div style="margin-top:20px;padding-top:20px;border-top:1px solid #2a2a2a;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9a9a9a;">Message</p>
          <p style="margin:0;white-space:pre-wrap;line-height:1.6;color:#f5f5f5;">${safeMessage}</p>
        </div>
      </div>
      <div style="padding:16px 24px;background:#101010;border-top:1px solid #2a2a2a;color:#777777;font-size:12px;">
        Sent ${escapeHtml(sentAt)}
      </div>
    </div>
  </body>
</html>`;

  const text = [
    "New contact form submission",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Reason: ${reason}`,
    "",
    "Message:",
    data.message,
    "",
    "--",
    `Sent: ${sentAt}`,
    userAgent ? `User agent: ${userAgent}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text, reason };
}

export default async function handler(req: ContactRequest, res: ContactResponse): Promise<void> {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  if (!isAllowedOrigin(req)) {
    res.status(403).json({ error: "This request is not allowed." });
    return;
  }

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    res.setHeader("Retry-After", String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)));
    res.status(429).json({ error: "Too many messages sent. Please try again in a few minutes." });
    return;
  }

  const payload = parseBody(req.body);
  if (!payload) {
    res.status(400).json({ error: "Invalid request body." });
    return;
  }

  // Honeypot: real visitors never see or fill this field. Reply with a fake
  // success so bots cannot tell that their submission was discarded.
  if (readString(payload, "company").trim() !== "") {
    res.status(200).json({ ok: true });
    return;
  }

  const { data, error } = validate(payload);
  if (!data) {
    res.status(400).json({ error: error ?? "Invalid request." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const recipients = (process.env.CONTACT_TO_EMAIL ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "Portfolio Contact <onboarding@resend.dev>";

  if (!apiKey || recipients.length === 0) {
    console.error("[contact] Missing RESEND_API_KEY or CONTACT_TO_EMAIL environment variable.");
    res.status(500).json({ error: "The contact form is temporarily unavailable. Please email me directly." });
    return;
  }

  // Strip CR/LF from the configurable prefix as well (header injection).
  const subjectPrefix =
    (process.env.CONTACT_SUBJECT_PREFIX?.trim() || "Portfolio contact").replace(/[\r\n]+/g, " ") ||
    "Portfolio contact";

  const { html, text, reason } = buildEmail(data, {
    userAgent: getHeader(req, "user-agent") ?? "",
  });

  try {
    const resend = new Resend(apiKey);
    const { error: sendError } = await resend.emails.send({
      from,
      to: recipients,
      replyTo: data.email,
      subject: `${subjectPrefix} — ${reason} — ${data.name}`.slice(0, 150),
      html,
      text,
    });

    if (sendError) {
      console.error("[contact] Resend rejected the message:", sendError);
      res.status(502).json({ error: "The message could not be sent. Please try again or email me directly." });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (sendFailure) {
    console.error("[contact] Unexpected failure while sending the message:", sendFailure);
    res.status(500).json({ error: "The message could not be sent. Please try again or email me directly." });
  }
}