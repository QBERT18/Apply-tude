import { useNavigate, useSearchParams } from "react-router";
import { Check, ChevronRight, X } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import {
  APPLICATION_SORT_OPTIONS,
  APPLICATION_STATUSES,
  STATUS_BADGE_CLASSES,
} from "~/lib/constants/application.constants";
import { cn } from "~/lib/utils";

import type {
  AppSidebarProps,
  SidebarCategoryFilterProps,
} from "./app-sidebar.types";

function toggleMultiValue(
  current: URLSearchParams,
  key: string,
  value: string
): URLSearchParams {
  const next = new URLSearchParams(current);
  const existing = next.getAll(key);
  next.delete(key);
  if (existing.includes(value)) {
    existing.filter((v) => v !== value).forEach((v) => next.append(key, v));
  } else {
    [...existing, value].forEach((v) => next.append(key, v));
  }
  return next;
}

function setSingleValue(
  current: URLSearchParams,
  key: string,
  value: string | null
): URLSearchParams {
  const next = new URLSearchParams(current);
  if (value === null) {
    next.delete(key);
  } else {
    next.set(key, value);
  }
  return next;
}

export function AppSidebar({ allCategories, ...props }: AppSidebarProps) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarSortOptions />
        <SidebarSeparator className="mx-0" />
        <SidebarStatusFilter />
        <SidebarSeparator className="mx-0" />
        <SidebarCategoryFilter allCategories={allCategories} />
      </SidebarContent>
      <SidebarFooter>
        <ClearFiltersButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function SidebarCategoryFilter({ allCategories }: SidebarCategoryFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.getAll("category");

  function toggle(category: string) {
    setSearchParams(toggleMultiValue(searchParams, "category", category));
  }

  return (
    <SidebarGroup>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroupLabel
          className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          render={<CollapsibleTrigger />}
        >
          Categories
          <ChevronRight className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            {allCategories.length === 0 ? (
              <p className="px-2 py-1 text-xs text-muted-foreground">
                No categories yet
              </p>
            ) : (
              <SidebarMenu>
                {allCategories.map((category) => {
                  const active = selected.includes(category);
                  return (
                    <SidebarMenuItem key={category}>
                      <SidebarMenuButton onClick={() => toggle(category)}>
                        <div
                          data-active={active}
                          className="group/category-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                        >
                          <Check className="hidden size-3 text-sidebar-primary-foreground group-data-[active=true]/category-item:block" />
                        </div>
                        <span className="truncate">{category}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

function SidebarStatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selected = searchParams.getAll("status");

  function toggle(status: string) {
    setSearchParams(toggleMultiValue(searchParams, "status", status));
  }

  return (
    <SidebarGroup>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroupLabel
          className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          render={<CollapsibleTrigger />}
        >
          Status
          <ChevronRight className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {APPLICATION_STATUSES.map((status) => {
                const active = selected.includes(status.value);
                return (
                  <SidebarMenuItem key={status.value}>
                    <SidebarMenuButton onClick={() => toggle(status.value)}>
                      <div
                        data-active={active}
                        className="group/status-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                      >
                        <Check className="hidden size-3 text-sidebar-primary-foreground group-data-[active=true]/status-item:block" />
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          STATUS_BADGE_CLASSES[status.value]
                        )}
                      >
                        {status.label}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

function SidebarSortOptions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") ?? "updatedAt";
  const direction = searchParams.get("dir") === "asc" ? "asc" : "desc";

  function setField(value: string | null) {
    setSearchParams(setSingleValue(searchParams, "sort", value ?? "updatedAt"));
  }

  function setDirection(value: "asc" | "desc") {
    setSearchParams(setSingleValue(searchParams, "dir", value));
  }

  return (
    <SidebarGroup>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroupLabel
          className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          render={<CollapsibleTrigger />}
        >
          Sort
          <ChevronRight className="ml-auto transition-transform group-data-open/collapsible:rotate-90" />
        </SidebarGroupLabel>
        <CollapsibleContent>
          <SidebarGroupContent className="space-y-2 px-2 py-1">
            <Select value={sort} onValueChange={setField}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLICATION_SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-1 rounded-md border border-sidebar-border p-0.5">
              <button
                type="button"
                onClick={() => setDirection("desc")}
                className={cn(
                  "rounded px-2 py-1 text-xs font-medium",
                  direction === "desc"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:text-sidebar-foreground"
                )}
              >
                Descending
              </button>
              <button
                type="button"
                onClick={() => setDirection("asc")}
                className={cn(
                  "rounded px-2 py-1 text-xs font-medium",
                  direction === "asc"
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:text-sidebar-foreground"
                )}
              >
                Ascending
              </button>
            </div>
          </SidebarGroupContent>
        </CollapsibleContent>
      </Collapsible>
    </SidebarGroup>
  );
}

function ClearFiltersButton() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasFilters = searchParams.size > 0;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => navigate("/")}
          disabled={!hasFilters}
          className="data-[disabled=true]:opacity-50"
          data-disabled={!hasFilters || undefined}
        >
          <X />
          <span>Clear filters</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
