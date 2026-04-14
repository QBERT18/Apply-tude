import { Check } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const plans = [
  {
    name: "Self-Hosted",
    price: "$0",
    audience: "Free forever",
    features: [
      "Unlimited Applications",
      "Local Ollama AI Model",
      "Your Own Storage",
      "Full Data Ownership",
      "Community Support",
    ],
  },
  {
    name: "Cloud Pro",
    price: "$9",
    audience: "For power users",
    features: [
      "Unlimited Applications",
      "25 GB Cloud Storage",
      "GPT-4o AI Auto-Fill",
      "Document Scanning",
      "Priority Support",
    ],
  },
  {
    name: "Cloud Team",
    price: "$29",
    audience: "For teams & agencies",
    features: [
      "Everything in Cloud Pro",
      "100 GB Cloud Storage",
      "Team Collaboration",
      "Dedicated AI Models",
      "Dedicated Support",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <p className="text-sm font-medium text-primary">Pricing</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose the{" "}
            <span className="bg-linear-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
              perfect plan
            </span>{" "}
            for you
          </h2>
          <p className="text-muted-foreground">
            Self-host for free with a local AI model, or upgrade to the cloud
            for more storage and powerful AI.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="flex flex-col">
              <CardHeader className="space-y-4 text-center">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div>
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    / month
                  </span>
                </div>
                <p className="text-sm italic text-muted-foreground">
                  {plan.audience}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
                  Get Started
                </Button>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
