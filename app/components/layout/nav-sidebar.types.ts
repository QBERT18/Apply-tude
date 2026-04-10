import type { ComponentProps } from "react";

import type { Sidebar } from "~/components/ui/sidebar";
import type { SerializedUser } from "~/lib/models/user.types";

export type NavSidebarProps = ComponentProps<typeof Sidebar> & {
  user: SerializedUser | null;
};
