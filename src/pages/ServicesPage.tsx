import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/portfolio/Layout";
import SectionHeader from "@/components/portfolio/SectionHeader";
import ContactRow from "@/components/portfolio/ContactRow";
import Accordion from "@/components/portfolio/services/Accordion";
import PackageCard from "@/components/portfolio/services/PackageCard";
import PackageComparison from "@/components/portfolio/services/PackageComparison";
import ProjectBrief from "@/components/portfolio/services/ProjectBrief";
import { scrollToSection } from "@/components/navigation";
import { personalInfo } from "@/data/personalInfo";
import {
  HOURLY_RATE,
  carePlans,
  findPackage,
  formatAddonPrice,
  formatPrice,
  formatRange,
  serviceAddons,
  servicePackages,
} from "@/data/services";

/**
 * Freelance services page: packages, the project brief, then the process,
 * add-ons and FAQ for anyone who wants the details.
 *
 * Kept deliberately short — the full price list lives in the proposal
 * documents. The homepage stays focused on full-time roles; this page is
 * reached from a quiet link in the Services section and the footer, or shared
 * directly with clients. Section ids must not collide with homepage sections
 * (about, skills, …). The brief uses `contact` with `data-page-section`, so the
 * navbar's Contact link and the "Let's talk" button scroll to it on this page.
 */

const steps = [
  { title: "Brief & call", description: "A short call about your goals." },
  { title: "Proposal", description: "Fixed price and timeline in 2 business days." },
  { title: "Design", description: "2–3 concepts, you pick one." },
  { title: "Build & launch", description: "Weekly previews, then go live." },
];

const faqLinkClass = "text-accent underline-offset-4 hover:underline";

interface FaqPoint {
  /** Short bold prefix, so a row can be scanned without reading all of it. */
  label?: string;
  text: ReactNode;
}

interface FaqItem {
  question: string;
  /** The direct answer, in one sentence. */
  lead: string;
  points?: FaqPoint[];
}

const faqGroups: { title: string; items: FaqItem[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        question: "How do I place an order?",
        lead: "Fill in the brief, or contact me directly. Either way, we start with a short call.",
        points: [
          {
            label: "Brief",
            text: (
              <>
                <a
                  href="#contact"
                  className={faqLinkClass}
                  onClick={(event) => {
                    event.preventDefault();
                    scrollToSection("#contact");
                  }}
                >
                  takes a few minutes
                </a>{" "}
                and gives you a rough estimate. I reply within 1–2 business days.
              </>
            ),
          },
          {
            label: "Direct",
            text: (
              <>
                <a href={`mailto:${personalInfo.email}`} className={faqLinkClass}>
                  email
                </a>{" "}
                or{" "}
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={faqLinkClass}>
                  LinkedIn
                </a>
                , if you'd rather just describe your project.
              </>
            ),
          },
          {
            label: "Next",
            text: "a short call, then a fixed price and timeline within 2 business days, then the contract and deposit.",
          },
        ],
      },
      {
        question: "Why do we sign a contract, and is it safe?",
        lead: "Yes. It protects both of us by putting everything we agreed on in writing, and you read it before anything is paid.",
        points: [
          { label: "For you", text: "the scope, fixed price, timeline, revisions and your ownership of the site are guaranteed." },
          { label: "For me", text: "the payment schedule, the deadlines for your content and feedback, and what counts as extra work are clear." },
          { label: "If something changes", text: "we refer back to the contract and agree on any change in writing first." },
        ],
      },
      {
        question: "How does payment work?",
        lead: "You pay in stages by Interac e-Transfer, and invoices are due within 7 days.",
        points: [
          { label: "Under $2,000", text: "50% deposit, 50% before launch." },
          { label: "$2,000 and up", text: "40% deposit, 30% after design approval, 30% before launch." },
          { label: "Website Audit", text: "paid in full upfront." },
          { label: "Care plans", text: "monthly in advance." },
          { text: "The deposit is non-refundable, as it reserves my time." },
        ],
      },
      {
        question: "When does the timeline start?",
        lead: "Once the contract is signed, the deposit is paid and I have your text and photos.",
        points: [
          { text: "If content or feedback is delayed by more than 14 days, the project pauses and resumes at my next available opening." },
        ],
      },
    ],
  },
  {
    title: "During the project",
    items: [
      {
        question: "How many rounds of revisions are included?",
        lead: "1 to 3, depending on your package. One round is one combined list of changes.",
        points: [
          { label: "Landing", text: "1 round." },
          { label: "Small Business and E-commerce", text: "2 rounds." },
          { label: "Business Pro", text: "3 rounds." },
          { label: "Extra rounds", text: `${formatPrice(HOURLY_RATE)} / hour, agreed with you before I start.` },
        ],
      },
      {
        question: "Do you write the text or take the photos?",
        lead: "No. Copywriting, translation, photography and logo design are not included.",
        points: [{ text: "I'll tell you what each page needs, and stock images can work as a start." },
        { text: "I can write basic placeholder text for you, but it will need to be replaced with your own content." },
        ],
      },
      {
        question: "What will my site be built on?",
        lead: "You don't need to decide. I'll recommend what fits on our call.",
        points: [
          { label: "Wix or Squarespace", text: "costs less up front and is simple to run, but has a monthly fee and platform limits." },
          { label: "Custom code", text: "costs more up front, with fewer limits. More control over design and functionality. Custom Admin Panel may be included." },
          { label: "Shopify (stores)", text: "has a monthly platform fee." },
        ],
      },
    ],
  },
  {
    title: "After launch",
    items: [
      {
        question: "Can I edit my site myself?",
        lead: "Yes, on almost every package. The one exception is a Landing page in custom code.",
        points: [
          { label: "Landing in custom code", text: "no editor, so send changes to me." },
          { label: "Landing on a website builder", text: "yes, in the builder." },
          { label: "Small Business and Business Pro", text: "yes, in the builder or in a dashboard on custom code." },
          { label: "E-commerce", text: "yes, in the Shopify dashboard." },
        ],
      },
      {
        question: "Who owns the website?",
        lead: "You do, once the project is paid in full.",
        points: [
          { text: "That covers the final design and the custom code written for it." },
          { text: "Domain, hosting and CMS accounts are in your name, with me added as a developer." },
        ],
      },
      {
        question: "What happens after launch?",
        lead: "You can choose a care plan or have edits billed hourly.",
        points: [
          { text: "Small Business sites in custom code and all Business Pro sites include a 30-day bug-fix warranty." },
        ],
      },
    ],
  },
  {
    title: "Good to know",
    items: [
      {
        question: "What is launch pricing?",
        lead: "Reduced rates for my first clients, in exchange for a short testimonial and a portfolio spot.",
        points: [{ text: "If you'd rather keep the project private, the regular price applies." }],
      },
      {
        question: "What does \"usable by everyone\" mean?",
        lead: "Clear text, good contrast, and pages that work with a keyboard or a screen reader.",
        points: [
          { label: "Custom code", text: "built to the WCAG 2.1 AA standard." },
          { label: "Website builders and Shopify", text: "same practices, as far as the platform allows." },
        ],
      },
      {
        question: "Are you available for full-time roles too?",
        lead: "Yes, I'm open to full-time frontend roles. Freelance projects are scheduled around that, one at a time.",
      },
    ],
  },
];

// Same width as the homepage sections.
const wrapperClass = "mx-auto max-w-6xl px-6";

const sectionTitleClass =
  "font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl";

const audit = findPackage("audit")!;
const quickFix = findPackage("quick-fix")!;

export default function ServicesPage() {
  const [packageId, setPackageId] = useState("");

  const startWithPackage = (id: string) => {
    setPackageId(id);
    scrollToSection("#contact");
  };

  const websitePackages = servicePackages.filter((pkg) => pkg.group === "website");

  return (
    <Layout>
      <div className={`${wrapperClass} py-24 mt-10`}>
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground mb-8 transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Button>
        </Link>

        <SectionHeader as="h1" preTitle="Work with me" title="Website Development in Ottawa" />

        <div className="mx-auto -mt-10 max-w-xl text-center">
          <p className="text-muted-foreground">
            Modern, fast, and mobile-ready websites designed to bring you clients. Fully managed setup with fixed pricing and no hidden costs — based in Ottawa, working nationwide.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="accent" className="gap-2" asChild>
              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("#contact");
                }}
                data-track="services_hero_brief"
              >
                Get An Estimate
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/projects" data-track="services_hero_projects">
                See my work
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <section id="packages" aria-labelledby="packages-title" className={`${wrapperClass} pb-24`}>
        <h2 id="packages-title" className={sectionTitleClass}>
          Packages
        </h2>
        <p className="mb-10 mt-3 text-muted-foreground">
          All hosting, domain and platform fees are paid separately by you. I can help you choose a plan and set everything up.
          <br></br>
          Every site works on phones, is usable by everyone, and is set up to be found on Google.
        </p>
        {/* pt-3 leaves room for the "Recommended" badge above the featured column. */}
        <div className="grid gap-6 pt-3 md:grid-cols-2 lg:grid-cols-4">
          {websitePackages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onSelect={startWithPackage} />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md">
          <Accordion title="Compare packages side by side">
            <PackageComparison packages={websitePackages} />
          </Accordion>
        </div>

        <br></br>
        <p className="mt-2 text-sm text-muted-foreground">
          Where you land in the range depends on your add-ons and what the site
          is built on. You don't need to choose: I'll recommend what fits on our
          call. Launch prices for my first clients, in exchange for a
          testimonial and a portfolio spot. All prices in CAD, no sales tax added.
        </p>
      </section>

      <section id="contact" data-page-section aria-labelledby="brief-title" className={`${wrapperClass} pb-24`}>
        <h2 id="brief-title" className={sectionTitleClass}>
          Get an estimate
        </h2>
        <p className="mb-10 mt-3 text-muted-foreground">
          A few quick steps. I'll reply within 1–2 business days.
        </p>
        <ProjectBrief packageId={packageId} onPackageChange={setPackageId} />
      </section>

      <section id="process" aria-labelledby="process-title" className={`${wrapperClass} pb-24`}>
        <h2 id="process-title" className={`${sectionTitleClass} mb-8`}>
          How we work together
        </h2>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="border-l border-accent/40 pl-4">
              <span className="font-mono text-xs text-accent/80" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="extras" aria-labelledby="extras-title" className={`${wrapperClass} pb-24`}>
        <h2 id="extras-title" className={`${sectionTitleClass} mb-8`}>
          Add-ons & care plans
        </h2>
        <div className="grid gap-10 md:grid-cols-2">
          <ul className="divide-y divide-border/50 text-sm">
            {serviceAddons.map((addon) => (
              <li key={addon.id} className="flex justify-between gap-4 py-3">
                <span className="text-foreground">{addon.label}</span>
                <span className="shrink-0 text-muted-foreground">{formatAddonPrice(addon)}</span>
              </li>
            ))}
            <li className="flex justify-between gap-4 py-3">
              <span className="text-foreground">Need something else? Ask me.</span>
              <span className="shrink-0 text-muted-foreground">On request</span>
            </li>
            <li className="flex justify-between gap-4 py-3">
              <span className="text-foreground">Edits and small features</span>
              <span className="shrink-0 text-muted-foreground">{formatPrice(HOURLY_RATE)} / hour</span>
            </li>
          </ul>

          <div>
            <ul className="divide-y divide-border/50 text-sm">
              {carePlans.map((plan) => (
                <li key={plan.id} className="flex justify-between gap-4 py-3">
                  <span>
                    <span className="text-foreground">{plan.name}</span>
                    <span className="text-muted-foreground"> — {plan.includes}</span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {formatPrice(plan.pricePerMonth)} / mo
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground/80">
              Care plans run for at least 3 months, then month to month.
            </p>
          </div>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-title" className={`${wrapperClass} pb-24`}>
        <h2 id="faq-title" className={`${sectionTitleClass} mb-8`}>
          FAQ
        </h2>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <div className="divide-y divide-border/50 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-md">
            {faqGroups.map((group) => (
              <div key={group.title}>
                <h3 className="px-6 pt-6 font-mono text-xs uppercase tracking-wider text-accent/80">
                  {group.title}
                </h3>
                <div className="divide-y divide-border/50">
                  {group.items.map((item) => (
                    <Accordion key={item.question} title={item.question} headingLevel="h4">
                      <p className="text-sm leading-relaxed text-foreground">{item.lead}</p>
                      {item.points && (
                        <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-accent/60">
                          {item.points.map((point, index) => (
                            <li key={point.label ?? index}>
                              {point.label && (
                                <span className="font-medium text-foreground">{point.label}: </span>
                              )}
                              {point.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </Accordion>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Same direct-contact rows as the homepage contact section. */}
          <aside aria-labelledby="direct-contact-title" className="lg:sticky lg:top-28">
            <h3 id="direct-contact-title" className="font-mono text-lg font-semibold text-foreground">
              Still have questions?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Write to me directly — I'm happy to talk it through.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <ContactRow
                icon={Mail}
                label="Email"
                value={personalInfo.email}
                href={`mailto:${personalInfo.email}`}
              />
              <ContactRow icon={MapPin} label="Location" value={personalInfo.address} />
              <ContactRow
                icon={Linkedin}
                label="LinkedIn"
                value="linkedin.com/in/anna-nikiforova-ac"
                href={personalInfo.linkedin}
                external
              />
              <ContactRow
                icon={Github}
                label="GitHub"
                value="github.com/Camperkunz"
                href={personalInfo.github}
                external
              />
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
