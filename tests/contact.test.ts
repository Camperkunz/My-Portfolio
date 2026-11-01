import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendMock, fetchMock } = vi.hoisted(() => ({ sendMock: vi.fn(), fetchMock: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import handler, { type ContactRequest, type ContactResponse } from "../api/contact";
import { estimateBrief, formatEstimate } from "../src/data/services";

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
  website_url_hp: "",
  elapsedMs: 5000,
  turnstileToken: "valid-token",
};

function createRequest(overrides: Partial<ContactRequest> = {}): ContactRequest {
  return {
    method: "POST",
    headers: {
      host: "portfolio.test",
      origin: "https://portfolio.test",
      "content-type": "application/json",
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
    process.env.TURNSTILE_SECRET_KEY = "turnstile_test_secret";
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "email_1" }, error: null });
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    fetchMock.mockReset();
    fetchMock.mockImplementation(async (_url: string, init: { body: URLSearchParams }) =>
      Response.json({ success: init.body.get("response") === "valid-token" }),
    );
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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
    const state = await submit(createRequest({ body: { ...VALID_PAYLOAD, website_url_hp: "https://spam.example" } }));

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
        headers: {
          host: "portfolio.test",
          origin: "https://evil.example",
          "content-type": "application/json",
          "x-forwarded-for": nextIp(),
        },
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
      "content-type": "application/json",
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

  it("discards submissions sent faster than a human could fill the form", async () => {
    const state = await submit(createRequest({ body: { ...VALID_PAYLOAD, elapsedMs: 800 } }));

    expect(state.statusCode).toBe(200);
    expect(jsonBody(state).ok).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects requests without a Turnstile token", async () => {
    const state = await submit(createRequest({ body: { ...VALID_PAYLOAD, turnstileToken: undefined } }));

    expect(state.statusCode).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects requests whose Turnstile token fails verification", async () => {
    const state = await submit(createRequest({ body: { ...VALID_PAYLOAD, turnstileToken: "forged" } }));

    expect(state.statusCode).toBe(403);
    expect(jsonBody(state).error).toContain("Spam check failed");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects requests when Turnstile cannot be reached", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("network down"));

    const state = await submit(createRequest());

    expect(state.statusCode).toBe(403);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("fails safely when the Turnstile secret is not configured", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;

    const state = await submit(createRequest());

    expect(state.statusCode).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects non-JSON request bodies", async () => {
    const request = createRequest();
    request.headers["content-type"] = "text/plain";

    const state = await submit(request);

    expect(state.statusCode).toBe(415);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects messages stuffed with links", async () => {
    const message = "Buy now https://a.example https://b.example https://c.example www.d.example";
    const state = await submit(createRequest({ body: { ...VALID_PAYLOAD, message } }));

    expect(state.statusCode).toBe(400);
    expect(jsonBody(state).error).toContain("no more than 3 links");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects links in the name field", async () => {
    const state = await submit(createRequest({ body: { ...VALID_PAYLOAD, name: "Visit www.spam.example" } }));

    expect(state.statusCode).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  describe("project brief", () => {
    const BRIEF_PAYLOAD = {
      ...VALID_PAYLOAD,
      reason: "freelance",
      message: "A site for my bakery with online orders.",
      brief: {
        packageId: "small-business",
        addonIds: ["blog", "language", "booking"],
        timeline: "rush",
        currentSite: "<b>instagram.com/sweetbakery</b>",
      },
    };

    it("adds the brief and a server-computed estimate to the email", async () => {
      const state = await submit(
        createRequest({ body: { ...BRIEF_PAYLOAD, estimate: { min: 1, max: 2 }, price: 1 } }),
      );

      expect(state.statusCode).toBe(200);
      const payload = sendMock.mock.calls[0][0] as { subject: string; html: string; text: string };
      const expected = formatEstimate(estimateBrief(BRIEF_PAYLOAD.brief)!);

      expect(payload.subject).toContain("Freelance project (Small Business)");
      expect(payload.html).toContain("Blog or news, Second language, Online booking");
      expect(payload.html).toContain("Rush");
      expect(payload.html).toContain(expected);
      expect(payload.html).toContain("&lt;b&gt;instagram.com/sweetbakery&lt;/b&gt;");
      expect(payload.html).not.toContain("<b>instagram");
      expect(payload.text).toContain(`Estimate: ${expected}`);
      expect(payload.text).not.toContain("$1 ");
    });

    it.each([
      ["an unknown package", { ...BRIEF_PAYLOAD.brief, packageId: "<script>" }],
      ["an unknown add-on", { ...BRIEF_PAYLOAD.brief, addonIds: ["free-forever"] }],
      ["duplicate add-ons", { ...BRIEF_PAYLOAD.brief, addonIds: ["blog", "blog"] }],
      ["an add-on from another package", { ...BRIEF_PAYLOAD.brief, packageId: "audit" }],
      ["several links as the current site", { ...BRIEF_PAYLOAD.brief, currentSite: "https://a.example https://b.example" }],
      ["too many add-ons", { ...BRIEF_PAYLOAD.brief, addonIds: Array.from({ length: 20 }, (_, i) => `a${i}`) }],
      ["non-string add-ons", { ...BRIEF_PAYLOAD.brief, addonIds: [{ id: "blog" }] }],
      ["an unknown timeline", { ...BRIEF_PAYLOAD.brief, timeline: "yesterday" }],
      ["an unknown impression", { ...BRIEF_PAYLOAD.brief, impression: "<script>" }],
      ["a link as the audience", { ...BRIEF_PAYLOAD.brief, audience: "https://a.example" }],
      ["several links as the reference", { ...BRIEF_PAYLOAD.brief, reference: "https://a.example https://b.example" }],
      ["a non-object brief", "small-business"],
    ])("rejects a brief with %s", async (_label, brief) => {
      const state = await submit(createRequest({ body: { ...BRIEF_PAYLOAD, brief } }));

      expect(state.statusCode).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("adds the design answers to the email, escaped", async () => {
      const brief = {
        ...BRIEF_PAYLOAD.brief,
        impression: "premium",
        audience: "<b>Families</b>",
        reference: "https://a.example",
      };
      const state = await submit(createRequest({ body: { ...BRIEF_PAYLOAD, brief } }));

      expect(state.statusCode).toBe(200);
      const email = sendMock.mock.calls[0][0] as { html: string; text: string };
      expect(email.html).toContain("Premium &amp; high-end");
      expect(email.html).toContain("&lt;b&gt;Families&lt;/b&gt;");
      expect(email.text).toContain("Reference: https://a.example");
    });

    it("accepts a brief with only the required ids", async () => {
      const brief = { packageId: "audit", addonIds: [], timeline: "standard" };
      const state = await submit(createRequest({ body: { ...BRIEF_PAYLOAD, brief } }));

      expect(state.statusCode).toBe(200);
      const payload = sendMock.mock.calls[0][0] as { text: string };
      expect(payload.text).toContain("Estimate: from $150 CAD");
      expect(payload.text).not.toContain("Current site:");
    });

    it("rejects a brief attached to a non-freelance reason", async () => {
      const state = await submit(createRequest({ body: { ...BRIEF_PAYLOAD, reason: "job" } }));

      expect(state.statusCode).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });
  });
});
