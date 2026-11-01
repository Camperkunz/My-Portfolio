import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, Plus, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { useTurnstile } from "@/hooks/useTurnstile";
import {
  AUDIENCE_MAX,
  CURRENT_SITE_MAX,
  EMAIL_MAX,
  MESSAGE_MAX,
  NAME_MAX,
  REFERENCE_MAX,
  getErrorMessage,
  getErrorType,
  postContact,
  validateEmail,
  validateMessage,
  validateName,
} from "@/lib/contactForm";
import {
  MAX_ADDONS,
  addonsForPackage,
  estimateBrief,
  findAddon,
  findImpression,
  findPackage,
  findTimeline,
  formatAddonPrice,
  formatEstimate,
  formatRange,
  serviceImpressions,
  servicePackages,
  serviceTimelines,
  type ServicePackage,
} from "@/data/services";

type StepId = "package" | "extras" | "design" | "project";

const STEP_LABELS: Record<StepId, string> = {
  package: "Package",
  extras: "Extras",
  design: "Design",
  project: "Your project",
};

// An existing site already has its look, so those packages skip the design step.
const stepsFor = (pkg: ServicePackage | undefined): StepId[] =>
  pkg?.group === "existing"
    ? ["package", "project"]
    : ["package", "extras", "design", "project"];

interface DetailsState {
  addonIds: string[];
  timeline: string;
  impression: string;
  audience: string;
  reference: string;
  message: string;
  name: string;
  email: string;
  currentSite: string;
  website_url_hp: string;
}

type TextField = "timeline" | "impression" | "audience" | "reference" | "message" | "name" | "email" | "currentSite" | "website_url_hp";
type FieldName = "packageId" | "message" | "name" | "email";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMPTY_DETAILS: DetailsState = {
  addonIds: [],
  timeline: "standard",
  impression: "",
  audience: "",
  reference: "",
  message: "",
  name: "",
  email: "",
  currentSite: "",
  website_url_hp: "",
};

const labelClass =
  "text-xs font-semibold uppercase tracking-widest text-muted-foreground";

const fieldClass =
  "w-full rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60";

const fieldErrorClass =
  "border-red-500/60 focus:border-red-500/60 focus-visible:ring-red-500/30";

// Radio/checkbox cards: the native input stays for keyboard and screen
// readers, the label carries the visual state.
const optionClass =
  "flex cursor-pointer items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-4 py-3 transition-colors hover:border-accent/40 has-[:checked]:border-accent/70 has-[:checked]:bg-accent/5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40";

const headingClass = "font-mono text-xl font-semibold text-foreground outline-none";

const packageGroups: { title: string; packages: ServicePackage[] }[] = [
  { title: "New website", packages: servicePackages.filter((entry) => entry.group !== "existing") },
  { title: "Already have a site", packages: servicePackages.filter((entry) => entry.group === "existing") },
];

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="text-xs text-red-400">
      {children}
    </p>
  );
}

interface ProjectBriefProps {
  /** Lifted to the page so "Start with this package" cards can preselect it. */
  packageId: string;
  onPackageChange: (packageId: string) => void;
}

/**
 * Multi-step project brief with a live price estimate.
 *
 * Sends to the same /api/contact endpoint as the contact form, with
 * `reason: "freelance"` and the selected ids under `brief`. Prices are shown
 * from the shared list in `src/data/services.ts`; the server recomputes the
 * estimate itself and ignores anything price-like from the client.
 */
export default function ProjectBrief({ packageId, onPackageChange }: ProjectBriefProps) {
  const [requestedStep, setRequestedStep] = useState<StepId>("package");
  const [details, setDetails] = useState<DetailsState>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const mountedAt = useRef(Date.now());
  const started = useRef(false);
  const stepChanged = useRef(false);
  const { token: turnstileToken, reset: resetTurnstile } = useTurnstile(
    formRef,
    turnstileRef,
  );

  const selectedPackage = findPackage(packageId);
  const steps = stepsFor(selectedPackage);
  // The package can change from the cards above while the brief is open: if
  // the current step no longer applies, the one after it takes over.
  const step = steps.includes(requestedStep) ? requestedStep : "project";
  const stepIndex = steps.indexOf(step);
  const hasDesignStep = steps.includes("design");
  const availableAddons = addonsForPackage(packageId);
  // Add-ons picked for another package stay in state (switching back restores
  // them), but only the ones that apply to this package count.
  const activeAddonIds = details.addonIds.filter((id) =>
    availableAddons.some((addon) => addon.id === id),
  );
  const { timeline } = details;
  const estimate = estimateBrief({ packageId, addonIds: activeAddonIds, timeline });
  const nextPackage = findPackage(selectedPackage?.nextPackageId ?? "");
  const includedAddons = (selectedPackage?.includedOneOf ?? []).map((id) => findAddon(id)?.label);

  // Move focus to the new step's heading so keyboard and screen reader users
  // land on the content that just replaced the previous step. Skipped on the
  // first render, which must not steal focus on page load.
  useEffect(() => {
    if (!stepChanged.current) return;
    headingRef.current?.focus();
  }, [step, sent]);

  // A package picked from the cards above clears the "choose a package" error.
  useEffect(() => {
    if (packageId) setErrors((current) => ({ ...current, packageId: undefined }));
  }, [packageId]);

  const markStarted = (field: string) => {
    if (started.current) return;
    started.current = true;
    track("form_start", { field, form: "project_brief" });
  };

  const update =
    (field: TextField) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = event.target;
        if (field !== "website_url_hp") markStarted(field);
        setDetails((current) => ({ ...current, [field]: value }));
        if ((field === "message" || field === "name" || field === "email") && errors[field]) {
          setErrors((current) => ({ ...current, [field]: undefined }));
        }
        setFeedback(null);
      };

  const toggleAddon = (id: string) => {
    markStarted("addonIds");
    setDetails((current) => ({
      ...current,
      addonIds: current.addonIds.includes(id)
        ? current.addonIds.filter((entry) => entry !== id)
        : [...current.addonIds, id].slice(0, MAX_ADDONS),
    }));
  };

  const selectPackage = (id: string) => {
    markStarted("packageId");
    onPackageChange(id);
  };

  const validateStep = (id: StepId): FieldErrors => {
    const next: FieldErrors = {};
    if (id === "package" && !selectedPackage) {
      next.packageId = "Please choose a package to start from.";
    }
    if (id === "project") {
      next.message = validateMessage(details.message);
      next.name = validateName(details.name);
      next.email = validateEmail(details.email);
    }
    return Object.fromEntries(
      Object.entries(next).filter(([, error]) => error),
    ) as FieldErrors;
  };

  const focusFirstInvalid = () => {
    window.requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus();
    });
  };

  const goTo = (id: StepId, list: StepId[] = steps) => {
    stepChanged.current = true;
    setFeedback(null);
    setRequestedStep(id);
    track("brief_step", { step: list.indexOf(id) + 1, step_name: STEP_LABELS[id] });
  };

  const goNext = () => {
    const stepErrors = validateStep(step);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      focusFirstInvalid();
      return;
    }
    goTo(steps[stepIndex + 1] ?? step);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Enter inside an earlier step moves forward instead of sending.
    if (step !== "project") {
      goNext();
      return;
    }

    if (isSending) return;

    const stepErrors = validateStep("project");
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      track("form_validation_error", {
        fields: Object.keys(stepErrors).join(","),
        form: "project_brief",
      });
      focusFirstInvalid();
      return;
    }

    if (!turnstileToken) {
      setFeedback(
        "Just a moment — we're checking that you're not a bot. Please try again in a few seconds.",
      );
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      track("form_submit_attempt", { reason: "freelance", form: "project_brief" });

      await postContact({
        name: details.name.trim(),
        email: details.email.trim(),
        reason: "freelance",
        message: details.message.trim(),
        brief: {
          packageId,
          addonIds: activeAddonIds,
          timeline,
          currentSite: details.currentSite.trim(),
          ...(hasDesignStep && {
            impression: details.impression,
            audience: details.audience.trim(),
            reference: details.reference.trim(),
          }),
        },
        website_url_hp: details.website_url_hp,
        elapsedMs: Date.now() - mountedAt.current,
        turnstileToken,
      });

      track("generate_lead", {
        reason: "freelance",
        method: "project_brief",
        package: packageId,
      });

      started.current = false;
      stepChanged.current = true;
      setSent(true);
      toast.success("Brief sent", {
        description: "Thanks! I'll reply within 1–2 business days.",
      });
    } catch (error) {
      const message = getErrorMessage(error);
      track("form_submit_error", {
        error_type: getErrorType(error),
        form: "project_brief",
      });
      setFeedback(message);
      toast.error("Brief not sent", { description: message });
    } finally {
      resetTurnstile();
      setIsSending(false);
    }
  };

  const startOver = () => {
    setDetails(EMPTY_DETAILS);
    setErrors({});
    setSent(false);
    onPackageChange("");
    goTo("package", stepsFor(undefined));
  };

  const selectedTimeline = findTimeline(timeline);
  const selectedImpression = hasDesignStep ? findImpression(details.impression) : undefined;
  // Optional steps with nothing filled in offer "Skip" instead of "Next".
  const isStepEmpty =
    (step === "extras" && activeAddonIds.length === 0) ||
    (step === "design" && !details.impression && !details.audience.trim() && !details.reference.trim());

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-label="Project brief"
        className="relative overflow-hidden rounded-xl border border-border/80 bg-card/30 backdrop-blur-md"
      >
        {sent ? (
          <div className="flex flex-col items-start gap-4 p-6 sm:p-8">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
            <h3 ref={headingRef} tabIndex={-1} className={cn(headingClass, "text-2xl")}>
              Thanks — your brief is on its way.
            </h3>
            <p role="status" className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              I'll reply within 1–2 business days to set up a short call. Keep an
              eye on your inbox (and spam folder).
            </p>
            <Button type="button" variant="outline" onClick={startOver}>
              Start another brief
            </Button>
          </div>
        ) : (
          <>
            <div className="p-6 sm:p-8">
              {/* Step indicator */}
              <ol
                className={cn("mb-8 grid gap-2", steps.length === 4 ? "grid-cols-4" : "grid-cols-3")}
                aria-label="Brief progress"
              >
                {steps.map((id, index) => (
                  <li
                    key={id}
                    aria-current={id === step ? "step" : undefined}
                    className="flex flex-col gap-2"
                  >
                    <span
                      className={cn(
                        "h-1 rounded-full transition-colors",
                        index <= stepIndex ? "bg-accent" : "bg-border/60",
                      )}
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        "font-mono text-[11px] uppercase tracking-widest",
                        // Four labels don't fit side by side on the narrowest phones.
                        id === step ? "text-foreground" : "text-muted-foreground/70 max-[374px]:sr-only",
                      )}
                    >
                      <span className="sr-only">Step {index + 1}: </span>
                      {STEP_LABELS[id]}
                    </span>
                  </li>
                ))}
              </ol>

              {step === "package" && (
                <fieldset className="grid gap-4">
                  <legend className="contents">
                    <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                      What should we start from?
                    </h3>
                  </legend>
                  {packageGroups.map((group, index) => (
                    <div
                      key={group.title}
                      className={cn("grid gap-3", index > 0 && "mt-2 border-t border-border/50 pt-5")}
                    >
                      <p className={labelClass}>{group.title}</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {group.packages.map((entry) => (
                          <label key={entry.id} className={optionClass}>
                            <input
                              type="radio"
                              name="packageId"
                              value={entry.id}
                              checked={packageId === entry.id}
                              onChange={() => selectPackage(entry.id)}
                              aria-invalid={errors.packageId ? true : undefined}
                              aria-describedby={errors.packageId ? "brief-package-error" : undefined}
                              className="accent-accent"
                            />
                            <span className="grid flex-1 gap-0.5">
                              <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                                <span className="text-sm font-semibold text-foreground">{entry.name}</span>
                                <span className="text-xs text-muted-foreground">{formatRange(entry.price)}</span>
                              </span>
                              <span className="text-xs text-muted-foreground">{entry.shortFor}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <ErrorText id="brief-package-error">{errors.packageId}</ErrorText>
                </fieldset>
              )}

              {step === "extras" && (
                <fieldset className="grid gap-4">
                  <legend className="contents">
                    <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                      Anything to add?
                    </h3>
                  </legend>
                  <p className="-mt-2 text-sm text-muted-foreground">
                    Optional extras on top of {selectedPackage?.name ?? "the package"}.
                    Skip this step if you're not sure.
                    {includedAddons.length > 0 && (
                      <> One of these is already included: {includedAddons.join(", ")}.</>
                    )}
                  </p>
                  {availableAddons.length === 0 && (
                    <p className="rounded-lg border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                      No extras for this package — continue to the next step.
                    </p>
                  )}
                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableAddons.map((addon) => (
                      <label key={addon.id} className={cn(optionClass, "items-start py-4")}>
                        <input
                          type="checkbox"
                          name="addonIds"
                          value={addon.id}
                          checked={activeAddonIds.includes(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                          className="mt-1 accent-accent"
                        />
                        <span className="grid gap-1">
                          <span className="text-sm font-semibold text-foreground">{addon.label}</span>
                          <span className="text-xs leading-relaxed text-muted-foreground">
                            {addon.description}
                          </span>
                          <span className="text-xs text-accent/90">{formatAddonPrice(addon, packageId)}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === "design" && (
                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                      How should it feel?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      All optional. Skip this step if you're not sure, and we'll figure it out on the call.
                    </p>
                  </div>

                  <fieldset className="grid gap-3">
                    <legend className={cn(labelClass, "mb-3")}>What impression should the site make?</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {serviceImpressions.map((entry) => (
                        <label key={entry.id} className={optionClass}>
                          <input
                            type="radio"
                            name="impression"
                            value={entry.id}
                            checked={details.impression === entry.id}
                            onChange={update("impression")}
                            className="accent-accent"
                          />
                          <span className="text-sm font-semibold text-foreground">{entry.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-2">
                    <label htmlFor="brief-audience" className={labelClass}>
                      Who is it mainly for?
                    </label>
                    <input
                      id="brief-audience"
                      name="audience"
                      type="text"
                      maxLength={AUDIENCE_MAX}
                      placeholder="e.g. Couples planning a wedding"
                      value={details.audience}
                      onChange={update("audience")}
                      className={fieldClass}
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="brief-reference" className={labelClass}>
                      A site you like
                    </label>
                    <input
                      id="brief-reference"
                      name="reference"
                      type="text"
                      inputMode="url"
                      maxLength={REFERENCE_MAX}
                      placeholder="Paste a link for reference"
                      value={details.reference}
                      onChange={update("reference")}
                      className={fieldClass}
                    />
                  </div>
                </div>
              )}

              {step === "project" && (
                <div className="grid gap-5">
                  <h3 ref={headingRef} tabIndex={-1} className={headingClass}>
                    Tell me about the project
                  </h3>

                  <fieldset className="grid gap-3">
                    <legend className={cn(labelClass, "mb-3")}>Timeline</legend>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {serviceTimelines.map((entry) => (
                        <label key={entry.id} className={cn(optionClass, "items-start")}>
                          <input
                            type="radio"
                            name="timeline"
                            value={entry.id}
                            checked={timeline === entry.id}
                            onChange={update("timeline")}
                            disabled={isSending}
                            className="mt-1 accent-accent"
                          />
                          <span className="grid gap-0.5">
                            <span className="text-sm font-semibold text-foreground">{entry.label}</span>
                            <span className="text-xs text-muted-foreground">{entry.description}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label htmlFor="brief-name" className={labelClass}>
                        Name
                      </label>
                      <input
                        id="brief-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        maxLength={NAME_MAX}
                        placeholder="Your name"
                        value={details.name}
                        onChange={update("name")}
                        disabled={isSending}
                        aria-invalid={errors.name ? true : undefined}
                        aria-describedby={errors.name ? "brief-name-error" : undefined}
                        className={cn(fieldClass, errors.name && fieldErrorClass)}
                      />
                      <ErrorText id="brief-name-error">{errors.name}</ErrorText>
                    </div>

                    <div className="grid gap-2">
                      <label htmlFor="brief-email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="brief-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        maxLength={EMAIL_MAX}
                        placeholder="you@example.com"
                        value={details.email}
                        onChange={update("email")}
                        disabled={isSending}
                        aria-invalid={errors.email ? true : undefined}
                        aria-describedby={errors.email ? "brief-email-error" : undefined}
                        className={cn(fieldClass, errors.email && fieldErrorClass)}
                      />
                      <ErrorText id="brief-email-error">{errors.email}</ErrorText>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="brief-current-site" className={labelClass}>
                      Current site or Instagram{" "}
                      <span className="normal-case tracking-normal">(optional)</span>
                    </label>
                    <input
                      id="brief-current-site"
                      name="currentSite"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      maxLength={CURRENT_SITE_MAX}
                      placeholder="yourbusiness.com or @handle"
                      value={details.currentSite}
                      onChange={update("currentSite")}
                      disabled={isSending}
                      className={fieldClass}
                    />
                  </div>
                  {/*  */}
                  <br></br>
                  <div className="grid gap-2">
                    <div className="flex items-baseline justify-between gap-4">
                      <label htmlFor="brief-message" className={labelClass}>
                        About the project
                      </label>
                      <span className="text-[11px] tabular-nums text-muted-foreground/70">
                        {details.message.length}/{MESSAGE_MAX}
                      </span>
                    </div>
                    <textarea
                      id="brief-message"
                      name="message"
                      rows={5}
                      maxLength={MESSAGE_MAX}
                      placeholder="What does your business do, and when would you like to launch? Mention bookings or payments if you need them."
                      value={details.message}
                      onChange={update("message")}
                      disabled={isSending}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? "brief-message-error" : undefined}
                      className={cn(fieldClass, "min-h-[128px] resize-y", errors.message && fieldErrorClass)}
                    />
                    <ErrorText id="brief-message-error">{errors.message}</ErrorText>
                  </div>
                </div>
              )}

              <div
                className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
                aria-hidden="true"
              >
                <label htmlFor="brief-website-url-hp">Leave this field empty</label>
                <input
                  id="brief-website-url-hp"
                  name="website_url_hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={details.website_url_hp}
                  onChange={update("website_url_hp")}
                />
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                {stepIndex > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => goTo(steps[stepIndex - 1])}
                    disabled={isSending}
                    className="gap-2 text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                  </Button>
                ) : (
                  <span />
                )}

                {step !== "project" ? (
                  <Button type="submit" variant="accent" className="gap-2">
                    {isStepEmpty ? "Skip" : "Next"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button type="submit" variant="accent" size="lg" disabled={isSending} className="gap-2">
                    {isSending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" aria-hidden="true" />
                        Send brief
                      </>
                    )}
                  </Button>
                )}
              </div>

              {feedback && (
                <p role="alert" aria-live="assertive" className="mt-4 text-sm leading-relaxed text-red-400">
                  {feedback}
                </p>
              )}

            </div>
          </>
        )}

        {/* Stays mounted across steps so the widget is not torn down. */}
        <div ref={turnstileRef} className="px-6 pb-4 empty:hidden sm:px-8" />
      </form>

      {/* Live summary: sticky on desktop, follows the form on mobile. */}
      <aside
        aria-label="Your selection"
        className="rounded-xl border border-border/80 bg-card/30 p-6 backdrop-blur-md lg:sticky lg:top-28"
      >
        <p className={labelClass}>Your selection</p>
        {selectedPackage ? (
          <>
            <p className="mt-2 font-mono text-lg font-semibold text-foreground">{selectedPackage.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{selectedPackage.bestFor}</p>
            <ul className="mt-4 grid gap-2 text-sm">
              {selectedPackage.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
              {activeAddonIds.map((id) => (
                <li key={id} className="flex items-start gap-2 text-foreground">
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {findAddon(id)?.label}
                </li>
              ))}
              {selectedTimeline && selectedTimeline.multiplier !== 1 && (
                <li className="flex items-start gap-2 text-foreground">
                  <Plus className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {selectedTimeline.label} timeline (+{Math.round((selectedTimeline.multiplier - 1) * 100)}%)
                </li>
              )}
              {selectedImpression && selectedImpression.id !== "unsure" && (
                <li className="flex items-start gap-2 text-muted-foreground">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" aria-hidden="true" />
                  Feel: {selectedImpression.label}
                </li>
              )}
            </ul>
          </>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Pick a package to see what's included.
          </p>
        )}
        <div className="mt-5 border-t border-border/50 pt-5">
          <p className={labelClass}>Estimated price</p>
          <p className="mt-2 font-mono text-2xl font-bold text-foreground" aria-live="polite">
            {estimate ? formatEstimate(estimate) : "—"}
          </p>
        </div>
        {estimate?.exceedsPackage && selectedPackage && (
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            This is a lot for {selectedPackage.name}.{" "}
            {nextPackage ? `${nextPackage.name} may fit better, let's talk.` : "Let's talk about the best way to do it."}
          </p>
        )}
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground/80">
          Launch prices in CAD, no sales tax. A rough range, not a quote —
          you'll get a fixed price after a short call.
        </p>
      </aside>
    </div>
  );
}
