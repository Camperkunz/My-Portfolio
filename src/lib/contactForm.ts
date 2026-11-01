/**
 * Client-side rules and helpers shared by the contact form and the project
 * brief. The limits and EMAIL_PATTERN duplicate `api/contact.ts` and must stay
 * in sync with it.
 */

export const EMAIL_PATTERN = /^[^\s@"<>()[\],;:]+@[^\s@"<>()[\],;:]+\.[^\s@"<>()[\],;:]{2,}$/;
export const NAME_MIN = 2;
export const NAME_MAX = 80;
export const EMAIL_MAX = 254;
export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;
export const CURRENT_SITE_MAX = 200;
export const AUDIENCE_MAX = 120;
export const REFERENCE_MAX = 200;

export function validateName(value: string): string | undefined {
  const name = value.trim();
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return `Please enter your name (${NAME_MIN}–${NAME_MAX} characters).`;
  }
}

export function validateEmail(value: string): string | undefined {
  const email = value.trim();
  if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) {
    return "Please enter a valid email address.";
  }
}

export function validateMessage(value: string): string | undefined {
  const message = value.trim();
  if (message.length < MESSAGE_MIN) {
    return `Please add a message of at least ${MESSAGE_MIN} characters.`;
  }
  if (message.length > MESSAGE_MAX) {
    return `Please keep your message under ${MESSAGE_MAX} characters.`;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "The request took too long. Please check your connection and try again.";
  }

  if (error instanceof TypeError) {
    return "Network error — please check your connection and try again.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again in a moment.";
}

export function getErrorType(
  error: unknown,
): "timeout" | "network" | "server_or_unknown" {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "timeout";
  }

  if (error instanceof TypeError) {
    return "network";
  }

  return "server_or_unknown";
}

/**
 * POSTs a submission to /api/contact with a 20 s timeout. Resolves on success
 * and throws an Error carrying the server's message otherwise.
 */
export async function postContact(body: Record<string, unknown>): Promise<void> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => null)) as {
      ok?: boolean;
      error?: string;
    } | null;

    if (!response.ok || !data?.ok) {
      throw new Error(
        data?.error || "Something went wrong. Please try again in a moment.",
      );
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}
