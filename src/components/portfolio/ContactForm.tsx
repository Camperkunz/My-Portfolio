import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckCircle2, ChevronDown, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

const REASONS = [
  { value: "job", label: "Job opportunity" },
  { value: "freelance", label: "Freelance project" },
  { value: "collaboration", label: "Collaboration" },
  { value: "other", label: "Other" },
] as const;

type Reason = (typeof REASONS)[number]["value"];

interface FormState {
  name: string;
  email: string;
  reason: "" | Reason;
  message: string;
  company: string;
}

type FieldName = keyof Pick<
  FormState,
  "name" | "email" | "reason" | "message"
>;
type FieldErrors = Partial<Record<FieldName, string>>;

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  reason: "",
  message: "",
  company: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MESSAGE_MAX = 2000;

const labelClass =
  "text-xs font-semibold uppercase tracking-widest text-muted-foreground";

const fieldClass =
  "w-full rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60";

const fieldErrorClass =
  "border-red-500/60 focus:border-red-500/60 focus-visible:ring-red-500/30";

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const message = form.message.trim();

  if (name.length < 2 || name.length > 80) {
    errors.name = "Please enter your name (2–80 characters).";
  }

  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!form.reason) {
    errors.reason = "Please choose a reason for reaching out.";
  }

  if (message.length < 10) {
    errors.message = "Please add a message of at least 10 characters.";
  } else if (message.length > MESSAGE_MAX) {
    errors.message = `Please keep your message under ${MESSAGE_MAX} characters.`;
  }

  return errors;
}

function getErrorMessage(error: unknown): string {
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

function getErrorType(
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

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const started = useRef(false);

  const update =
    (field: keyof FormState) =>
      (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const { value } = event.target;

        if (field !== "company" && !started.current) {
          started.current = true;
          track("form_start", { field });
        }

        setForm((current) => ({ ...current, [field]: value }));

        if (field !== "company" && errors[field]) {
          setErrors((current) => ({ ...current, [field]: undefined }));
        }

        if (feedback) {
          setFeedback(null);
        }
      };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSending) return;

    if (form.company.trim() !== "") {
      setForm(EMPTY_FORM);
      return;
    }

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      track("form_validation_error", {
        fields: Object.keys(nextErrors).join(","),
      });

      setFeedback({
        type: "error",
        text: "Please fix the highlighted fields and try again.",
      });

      window.requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus();
      });

      return;
    }

    setIsSending(true);
    setFeedback(null);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      20_000,
    );

    try {
      track("form_submit_attempt", { reason: form.reason });

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          reason: form.reason,
          message: form.message.trim(),
          company: form.company,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        throw new Error(
          data?.error ||
          "Something went wrong. Please try again in a moment.",
        );
      }

      track("generate_lead", {
        reason: form.reason,
        method: "contact_form",
      });

      started.current = false;
      setForm(EMPTY_FORM);
      setErrors({});
      setFeedback({
        type: "success",
        text: "Thank you for reaching out — I'll get back to you as soon as I can.",
      });

      toast.success("Message sent", {
        description: "Thanks for getting in touch!",
      });
    } catch (error) {
      const message = getErrorMessage(error);

      track("form_submit_error", {
        error_type: getErrorType(error),
      });

      setFeedback({ type: "error", text: message });
      toast.error("Message not sent", { description: message });
    } finally {
      window.clearTimeout(timeoutId);
      setIsSending(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="relative rounded-xl border border-border/80 bg-card/30 p-6 backdrop-blur-md sm:p-8"
    >
      <div className="grid gap-5">
        <div className="grid gap-2">
          <label htmlFor="contact-name" className={labelClass}>
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            placeholder="Your name"
            value={form.name}
            onChange={update("name")}
            disabled={isSending}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={
              errors.name ? "contact-name-error" : undefined
            }
            className={cn(fieldClass, errors.name && fieldErrorClass)}
          />
          {errors.name && (
            <p
              id="contact-name-error"
              role="alert"
              className="text-xs text-red-400"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="contact-email" className={labelClass}>
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            disabled={isSending}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={
              errors.email ? "contact-email-error" : undefined
            }
            className={cn(fieldClass, errors.email && fieldErrorClass)}
          />
          {errors.email && (
            <p
              id="contact-email-error"
              role="alert"
              className="text-xs text-red-400"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label htmlFor="contact-reason" className={labelClass}>
            Reason for reaching out
          </label>
          <div className="relative">
            <select
              id="contact-reason"
              name="reason"
              required
              value={form.reason}
              onChange={update("reason")}
              disabled={isSending}
              aria-invalid={errors.reason ? true : undefined}
              aria-describedby={
                errors.reason ? "contact-reason-error" : undefined
              }
              className={cn(
                fieldClass,
                "appearance-none pr-10",
                !form.reason && "text-muted-foreground/60",
                errors.reason && fieldErrorClass,
              )}
            >
              <option
                value=""
                disabled
                className="bg-background text-foreground"
              >
                Select a reason
              </option>
              {REASONS.map((reason) => (
                <option
                  key={reason.value}
                  value={reason.value}
                  className="bg-background text-foreground"
                >
                  {reason.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          {errors.reason && (
            <p
              id="contact-reason-error"
              role="alert"
              className="text-xs text-red-400"
            >
              {errors.reason}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="contact-message" className={labelClass}>
              Message
            </label>
            <span className="text-[11px] tabular-nums text-muted-foreground/70">
              {form.message.length}/{MESSAGE_MAX}
            </span>
          </div>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            maxLength={MESSAGE_MAX}
            placeholder="A few words about the role, project or idea…"
            value={form.message}
            onChange={update("message")}
            disabled={isSending}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            className={cn(
              fieldClass,
              "min-h-[132px] resize-y",
              errors.message && fieldErrorClass,
            )}
          />
          {errors.message && (
            <p
              id="contact-message-error"
              role="alert"
              className="text-xs text-red-400"
            >
              {errors.message}
            </p>
          )}
        </div>

        <div
          className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
          aria-hidden="true"
        >
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.company}
            onChange={update("company")}
          />
        </div>

        <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isSending}
            className="w-full gap-2 sm:w-auto"
          >
            {isSending ? (
              <>
                <Loader2
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden="true" />
                Send message
              </>
            )}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground/70 sm:max-w-[220px] sm:text-right">
            Your details are only used to reply to this message.
          </p>
        </div>

        {feedback && (
          <p
            role={feedback.type === "error" ? "alert" : "status"}
            aria-live={feedback.type === "error" ? "assertive" : "polite"}
            className={cn(
              "flex items-start gap-2 text-sm leading-relaxed",
              feedback.type === "success"
                ? "text-emerald-400"
                : "text-red-400",
            )}
          >
            {feedback.type === "success" && (
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />
            )}
            <span>{feedback.text}</span>
          </p>
        )}
      </div>
    </form>
  );
}