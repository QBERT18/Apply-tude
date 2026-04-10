import {
  Briefcase,
  FileUp,
  FolderOpen,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Entry",
    description:
      "Automatically generate application entries from job postings using a local AI model. Paste a URL and let Ollama do the rest.",
  },
  {
    icon: Briefcase,
    title: "Application Tracking",
    description:
      "Track every application from submission to offer. Filter by status, category, and sort by what matters most.",
  },
  {
    icon: FolderOpen,
    title: "Smart Organization",
    description:
      "Categorize applications by role type, tech stack, or custom tags. Find any application in seconds.",
  },
  {
    icon: Users,
    title: "Contact Management",
    description:
      "Store hiring manager details, emails, and phone numbers alongside each application. Never lose a contact.",
  },
  {
    icon: FileUp,
    title: "Document Uploads",
    description:
      "Attach resumes, cover letters, and supporting documents directly to each application entry.",
  },
  {
    icon: Shield,
    title: "Self-Hosted & Private",
    description:
      "Deploy on your own infrastructure. Your data stays on your server — no third-party access, ever.",
  },
];

export function FeaturesSection() {
  return (
    <section id="product" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to{" "}
            <span className="bg-linear-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
              land the job
            </span>
          </h2>
          <p className="text-muted-foreground">
            A self-hosted application tracker built with React, TypeScript,
            Shadcn UI, and Tailwind CSS — with AI-powered automation on the
            horizon.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className="space-y-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-linear-to-br from-primary/20 to-violet-500/20">
                  <feature.icon className="size-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <Separator className="w-10" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
