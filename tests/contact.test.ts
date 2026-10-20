import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import handler, { type ContactRequest, type ContactResponse } from "../api/contact";

interface ResponseState {
  statusCode: number;
  body: unknown;
  headers: Record<string, string>;
}

function createResponse(): { res: ContactResponse; state: ResponseState } {
  const state: ResponseState = { statusCode: 200, body: undefined, headers: {} };
  const res: ContactResponse = {
    status(code) {
      state.statusCode = code;
      return res;
    },
    json(payload) {
      state.body = payload;
    },
    setHeader(name, value) {
      state.headers[name.toLowerCase()] = value;
    },
    end() {
      // no-op
    },
  };
  return { res, state };
}

let ipCounter = 0;
function nextIp(): string {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

const VALID_PAYLOAD = {
  name: "Jane Doe",
  email: "jane@example.com",
  reason: "job",
  message: "I would love to talk about a frontend role on your team.",
  company: "",
};

function createRequest(overrides: Partial<ContactRequest> = {}): ContactRequest {
  return {
    method: "POST",
    headers: {
      host: "portfolio.test",
      origin: "https://portfolio.test",
      "x-forwarded-for": nextIp(),
      "user-agent": "vitest",
    },
    body: { ...VALID_PAYLOAD },
    socket: { remoteAddress: "127.0.0.1" },
    ...overrides,
  };
}

async function submit(request: ContactRequest = createRequest()) {
  const { res, state } = createResponse();
  await handler(request, res);
  return state;
}

function jsonBody(state: ResponseState): { ok?: boolean; error?: string } {
  return state.body as { ok?: boolean; error?: string };
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.CONTACT_TO_EMAIL = "owner@example.com";
    process.env.CONTACT_FROM_EMAIL = "";
    process.env.CONTACT_SUBJECT_PREFIX = "";
    process.env.CONTACT_ALLOWED_ORIGINS = "";
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "email_1" }, error: null });
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects non-POST requests", async () => {
    const state = await submit(createRequest({ method: "GET" }));

    expect(state.statusCode).toBe(405);
    expect(state.headers.allow).toBe("POST");
    expect(jsonBody(state).error).toBe("Method not allowed.");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email address", async () => {
    const state = await submit(createRequest({ body: { ...VALID_PAYLOAD, email: "not-an-email" } }));

    expect(state.statusCode).toBe(400);
    expect(jsonBody(state).error).toContain("valid email");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects a too-short message", async () => {
    const state = await submit(createRequest({ body: { ...VALID_PAYLOAD, message: "Hi" } }));

    expect(state.statusCode).toBe(400);
    expect(jsonBody(state).error).toContain("at least 10 characters");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("discards honeypot submissions while reporting success", async () => {
    const state = await submit(createRequest({ body: { ...VALID_PAYLOAD, company: "Spam Ltd." } }));

    expect(state.statusCode).toBe(200);
    expect(jsonBody(state).ok).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
  });
  it("sends a valid submission through Resend with escaped content", async () => {
    const state = await submit(
      createRequest({
        body: {
          ...VALID_PAYLOAD,
          name: "<b>Jane</b>",
          message: "<script>alert(1)</script> Please get in touch about the role.",
        },
      }),
    );

    expect(state.statusCode).toBe(200);
    expect(jsonBody(state).ok).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);

    const payload = sendMock.mock.calls[0][0] as {
      from: string;
      to: string[];
      replyTo: string;
      subject: string;
      html: string;
      text: string;
    };

    expect(payload.from).toBe("Portfolio Contact <onboarding@resend.dev>");
    expect(payload.to).toEqual(["owner@example.com"]);
    expect(payload.replyTo).toBe("jane@example.com");
    expect(payload.subject).toContain("Job opportunity");
    expect(payload.subject).toContain("<b>Jane</b>");
    expect(payload.html).toContain("&lt;b&gt;Jane&lt;/b&gt;");
    expect(payload.html).not.toContain("<b>Jane</b>");
    expect(payload.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(payload.text).toContain("Reason: Job opportunity");
  });

  it("rejects browser requests from a foreign origin", async () => {
    const state = await submit(
      createRequest({
        headers: { host: "portfolio.test", origin: "https://evil.example", "x-forwarded-for": nextIp() },
      }),
    );

    expect(state.statusCode).toBe(403);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("fails safely when the Resend environment is not configured", async () => {
    delete process.env.RESEND_API_KEY;

    const state = await submit(createRequest());

    expect(state.statusCode).toBe(500);
    expect(jsonBody(state).error).toContain("temporarily unavailable");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rate-limits repeated submissions from the same IP", async () => {
    const headers = {
      host: "portfolio.test",
      origin: "https://portfolio.test",
      "x-forwarded-for": "198.51.100.77",
    };

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const state = await submit(createRequest({ headers }));
      expect(state.statusCode).toBe(200);
    }

    const limited = await submit(createRequest({ headers }));
    expect(limited.statusCode).toBe(429);
    expect(limited.headers["retry-after"]).toBe("600");
    expect(sendMock).toHaveBeenCalledTimes(5);
  });
});


