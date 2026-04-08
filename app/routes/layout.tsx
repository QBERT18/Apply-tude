import { Link, Outlet } from "react-router";

import type { Route } from "./+types/layout";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { ThemeToggle } from "~/components/theme-toggle";
import { TooltipProvider } from "~/components/ui/tooltip";
import { listAllCategories } from "~/lib/models/application.queries.server";

export async function loader(_: Route.LoaderArgs) {
  return { allCategories: await listAllCategories() };
}

export default function AppLayout({ loaderData }: Route.ComponentProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar allCategories={loaderData.allCategories} />
        <SidebarInset>
          <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-6 data-vertical:self-auto"
            />
            <Link
              to="/"
              className="flex h-fit w-48 items-center overflow-hidden"
            >
              <img
                src="/logo.png"
                alt="Apply-tude"
                className="h-auto w-full object-contain"
              />
            </Link>
            <ThemeToggle className="ml-auto" />
          </header>
          <main className="flex-1">
            <div className="container mx-auto w-full max-w-5xl px-4 pt-8 pb-16">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
