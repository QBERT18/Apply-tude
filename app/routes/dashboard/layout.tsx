import { Outlet, useLocation } from "react-router";

import type { Route } from "./+types/layout";
import { requireUserId } from "~/lib/auth.server";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { NavSidebar } from "~/components/layout/nav-sidebar";
import { Separator } from "~/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { ThemeToggle } from "~/components/theme-toggle";
import { TooltipProvider } from "~/components/ui/tooltip";
import { listAllCategories } from "~/lib/models/application.queries.server";
import { findUserById } from "~/lib/models/user.queries.server";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const [allCategories, user] = await Promise.all([
    listAllCategories(userId),
    findUserById(userId),
  ]);
  return { allCategories, user, userId };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { pathname } = useLocation();
  const showFilterSidebar = pathname !== "/dashboard";

  return (
    <TooltipProvider>
      <SidebarProvider>
        <NavSidebar user={loaderData.user} />
        <SidebarInset>
          <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-6 data-vertical:self-auto"
            />
            <ThemeToggle className="ml-auto" />
          </header>
          <main className="flex-1">
            <div className="container mx-auto w-full max-w-7xl px-4 pt-8 pb-16">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
        {showFilterSidebar && (
          <AppSidebar allCategories={loaderData.allCategories} />
        )}
      </SidebarProvider>
    </TooltipProvider>
  );
}
