import { Link, useLocation } from "react-router";
import { BarChart3, Briefcase, LogOut } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";

import type { NavSidebarProps } from "./nav-sidebar.types";

const navItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Applications",
    url: "/dashboard/applications",
    icon: Briefcase,
  },
];

export function NavSidebar({ user, ...props }: NavSidebarProps) {
  const { pathname } = useLocation();
  const userName = user?.name ?? "User";
  const userEmail = user?.email ?? "";
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="h-20 items-center justify-center border-b border-sidebar-border">
        <Link
          to="/dashboard"
          className="flex h-fit w-40 items-center overflow-hidden"
        >
          <img
            src="/logo.png"
            alt="Apply-tude"
            className="h-auto w-full object-contain"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    render={<Link to={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="aria-expanded:bg-muted"
                  />
                }
              >
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side="right"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-2 text-left text-sm">
                      <Avatar>
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 leading-tight">
                        <span className="truncate font-medium">{userName}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {userEmail}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    const form = document.createElement("form");
                    form.method = "post";
                    form.action = "/logout";
                    document.body.appendChild(form);
                    form.submit();
                  }}
                >
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
