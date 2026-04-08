import type { ComponentProps } from "react";

import type { Sidebar } from "~/components/ui/sidebar";

export type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  allCategories: string[];
};

export type SidebarCategoryFilterProps = {
  allCategories: string[];
};
