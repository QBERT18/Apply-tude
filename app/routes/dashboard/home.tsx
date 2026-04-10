import { BarChart3 } from "lucide-react";

import type { Route } from "./+types/home";
import { Card, CardContent } from "~/components/ui/card";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Overview — Apply-tude" }];
}

export default function Overview() {
  return (
    <div className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">Overview</h1>
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <BarChart3 className="size-12 text-muted-foreground" />
          <h2 className="font-heading text-xl font-semibold">Coming soon</h2>
          <p className="max-w-md text-muted-foreground">
            Charts, statistics, and insights about your job applications will
            appear here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
