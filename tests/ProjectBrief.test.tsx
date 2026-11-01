// @vitest-environment jsdom
import { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ProjectBrief from "../src/components/portfolio/services/ProjectBrief";
import { addonsForPackage, estimateBrief, findPackage, formatEstimate } from "../src/data/services";

// The real widget needs Cloudflare; the brief only needs a token to send.
vi.mock("../src/hooks/useTurnstile", () => ({
  useTurnstile: () => ({ token: "test-token", reset: vi.fn() }),
}));
vi.mock("../src/lib/analytics", () => ({ track: vi.fn() }));
vi.mock("../src/components/ui/sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

function Harness() {
  const [packageId, setPackageId] = useState("");
  return <ProjectBrief packageId={packageId} onPackageChange={setPackageId} />;
}

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockResolvedValue(Response.json({ ok: true }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const next = () => fireEvent.click(screen.getByRole("button", { name: /next|skip/i }));

describe("ProjectBrief", () => {
  const pkg = findPackage("small-business")!;
  const addon = addonsForPackage(pkg.id)[0];

  it("asks for a package before moving on", () => {
    render(<Harness />);
    next();

    expect(screen.getByRole("alert").textContent).toMatch(/choose a package/i);
    expect(screen.getByText("What should we start from?")).toBeTruthy();
  });

  it("walks through every step, updates the estimate and sends the brief", async () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("radio", { name: new RegExp(pkg.name) }));
    const packageOnly = formatEstimate(estimateBrief({ packageId: pkg.id, addonIds: [], timeline: "standard" })!);
    expect(screen.getByText(packageOnly)).toBeTruthy();
    next();

    fireEvent.click(screen.getByRole("checkbox", { name: new RegExp(addon.label) }));
    const withAddon = formatEstimate(
      estimateBrief({ packageId: pkg.id, addonIds: [addon.id], timeline: "standard" })!,
    );
    expect(screen.getByText(withAddon)).toBeTruthy();
    next();

    // Design step: optional answers that go along with the brief.
    fireEvent.click(screen.getByRole("radio", { name: /premium/i }));
    fireEvent.change(screen.getByLabelText(/mainly for/i), { target: { value: "Local families" } });
    fireEvent.change(screen.getByLabelText(/site you like/i), { target: { value: "https://example.com" } });
    expect(screen.getByText(/Feel: Premium/)).toBeTruthy();
    next();

    // The timeline sits at the top of the last step.
    fireEvent.click(screen.getByRole("radio", { name: /rush/i }));
    const withRush = formatEstimate(
      estimateBrief({ packageId: pkg.id, addonIds: [addon.id], timeline: "rush" })!,
    );
    expect(screen.getByText(withRush)).toBeTruthy();

    // The last step validates the description and contact details together.
    fireEvent.click(screen.getByRole("button", { name: /send brief/i }));
    expect(screen.getAllByRole("alert")[0].textContent).toMatch(/at least 10 characters/i);
    fireEvent.change(screen.getByLabelText("About the project"), {
      target: { value: "A new site for my bakery with online orders." },
    });
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByLabelText(/current site/i), { target: { value: "@sweetbakery" } });
    fireEvent.click(screen.getByRole("button", { name: /send brief/i }));

    await waitFor(() => expect(screen.getByText(/your brief is on its way/i)).toBeTruthy());

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);
    expect(url).toBe("/api/contact");
    expect(body).toMatchObject({
      name: "Jane Doe",
      email: "jane@example.com",
      reason: "freelance",
      message: "A new site for my bakery with online orders.",
      brief: {
        packageId: pkg.id,
        addonIds: [addon.id],
        timeline: "rush",
        currentSite: "@sweetbakery",
        impression: "premium",
        audience: "Local families",
        reference: "https://example.com",
      },
      turnstileToken: "test-token",
      website_url_hp: "",
    });
    // Prices are never sent: the server recomputes them.
    expect(JSON.stringify(body)).not.toMatch(/price|estimate|"min"|"max"/i);
  });

  it("only offers add-ons that fit the chosen package", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("radio", { name: /Website Audit/ }));
    next();

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0);
    expect(screen.getByText(/no extras for this package/i)).toBeTruthy();
  });

  it("never asks the client to choose a platform", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("radio", { name: new RegExp(pkg.name) }));

    expect(screen.queryByRole("radio", { name: /builder|custom/i })).toBeNull();
  });

  it("offers to talk when add-ons pass the top of the package", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("radio", { name: /Business Pro/ }));
    next();
    for (const box of screen.getAllByRole("checkbox")) fireEvent.click(box);

    expect(screen.getByText(/This is a lot for Business Pro/)).toBeTruthy();
  });

  it.each(["Landing", "E-commerce"])("offers %s with the design step", (name) => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("radio", { name: new RegExp(name) }));
    next();
    next();

    expect(screen.getByText("How should it feel?")).toBeTruthy();
  });

  it("skips the design step for packages that improve an existing site", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("radio", { name: /Website Audit/ }));
    next();
    next();

    expect(screen.queryByText("How should it feel?")).toBeNull();
    expect(screen.getByLabelText("About the project")).toBeTruthy();
  });

  it("describes the chosen package in the summary", () => {
    render(<Harness />);
    const summary = screen.getByRole("complementary", { name: "Your selection" });
    expect(summary.textContent).toMatch(/pick a package/i);

    fireEvent.click(screen.getByRole("radio", { name: new RegExp(pkg.name) }));
    expect(summary.textContent).toContain(pkg.bestFor);
    expect(summary.textContent).toContain(pkg.includes[0]);
  });

  it("shows the server's error and keeps the answers", async () => {
    fetchMock.mockResolvedValue(Response.json({ error: "Please check the project brief and try again." }, { status: 400 }));
    render(<Harness />);

    fireEvent.click(screen.getByRole("radio", { name: new RegExp(pkg.name) }));
    next();
    next();
    next();
    fireEvent.change(screen.getByLabelText("About the project"), {
      target: { value: "A new site for my bakery with online orders." },
    });
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Jane Doe" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send brief/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toMatch("Please check the project brief"),
    );
    expect((screen.getByLabelText("Name") as HTMLInputElement).value).toBe("Jane Doe");
  });
});
