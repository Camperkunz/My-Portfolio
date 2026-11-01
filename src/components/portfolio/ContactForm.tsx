import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { CheckCircle2, ChevronDown, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { useTurnstile } from "@/hooks/useTurnstile";
import {
  MESSAGE_MAX,
  getErrorMessage,
  getErrorType,
  postContact,
  validateEmail,
  validateMessage,
  validateName,
} from "@/lib/contactForm";

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
  website_url_hp: string;
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
  website_url_hp: "",
};

const labelClass =
  "text-xs font-semibold uppercase tracking-widest text-muted-foreground";

const fieldClass =
  "w-full rounded-lg border border-border/60 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-accent/60 focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-60";

const fieldErrorClass =
  "border-red-500/60 focus:border-red-500/60 focus-visible:ring-red-500/30";

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    reason: form.reason ? undefined : "Please choose a reason for reaching out.",
    message: validateMessage(form.message),
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, error]) => error),
  ) as FieldErrors;
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
  const mountedAt = useRef(Date.now());
  const turnstileRef = useRef<HTMLDivElement>(null);
  const { token: turnstileToken, reset: resetTurnstile } = useTurnstile(
    formRef,
    turnstileRef,
  );

  const update =
    (field: keyof FormState) =>
      (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const { value } = event.target;

        if (field !== "website_url_hp" && !started.current) {
          started.current = true;
          track("form_start", { field });
        }

        setForm((current) => ({ ...current, [field]: value }));

        if (field !== "website_url_hp" && errors[field]) {
          setErrors((current) => ({ ...current, [field]: undefined }));
        }

        if (feedback) {
          setFeedback(null);
        }
      };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSending) return;

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

    if (!turnstileToken) {
      setFeedback({
        type: "error",
        text: "Just a moment — we're checking that you're not a bot. Please try again in a few seconds.",
      });
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      track("form_submit_attempt", { reason: form.reason });

      await postContact({
        name: form.name.trim(),
        email: form.email.trim(),
        reason: form.reason,
        message: form.message.trim(),
        website_url_hp: form.website_url_hp,
        elapsedMs: Date.now() - mountedAt.current,
        turnstileToken,
      });

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
      // Turnstile tokens are single-use, so fetch a fresh one for any retry.
      resetTurnstile();
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
          <label htmlFor="contact-website-url-hp">Leave this field empty</label>
          <input
            id="contact-website-url-hp"
            name="website_url_hp"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.website_url_hp}
            onChange={update("website_url_hp")}
          />
        </div>

        <div ref={turnstileRef} className="empty:hidden" />

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