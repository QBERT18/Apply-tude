import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const faqs = [
  {
    question: "Is Apply-tude really free?",
    answer:
      "Yes, the self-hosted version is completely free and always will be. Deploy on your own server, own your data, and use a local Ollama AI model at zero cost.",
  },
  {
    question: "How does the AI auto-fill work?",
    answer:
      "Paste a job posting URL and our AI extracts the company name, role, contact details, and more — creating a full application entry in seconds. The self-hosted version uses Ollama locally, while cloud plans use GPT-4o for higher accuracy.",
  },
  {
    question: "Can I migrate from self-hosted to cloud?",
    answer:
      "Absolutely. Export your data as JSON and import it into any cloud plan. Your applications, contacts, and categories transfer seamlessly.",
  },
  {
    question: "What happens to my data?",
    answer:
      "With self-hosted, your data never leaves your server. On cloud plans, data is encrypted at rest and in transit, and we never sell or share your information.",
  },
  {
    question: "Do I need technical skills to self-host?",
    answer:
      "Basic Docker knowledge is all you need. Our one-command Docker Compose setup gets you running in minutes with MongoDB and the app pre-configured.",
  },
  {
    question: "Can I collaborate with my team?",
    answer:
      "Team collaboration is available on the Cloud Team plan. Share application pipelines, assign contacts, and track progress together.",
  },
];

export function FaqSection() {
  return (
    <section className="bg-muted/50 py-24">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-medium text-primary">FAQ</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Got{" "}
            <span className="bg-linear-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
              questions
            </span>
            ?
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about Apply-tude.
          </p>
        </div>

        <Accordion className="mx-auto max-w-3xl">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
