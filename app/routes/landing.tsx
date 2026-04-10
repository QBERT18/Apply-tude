import { redirect } from "react-router";

import type { Route } from "./+types/landing";
import { getUserId } from "~/lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) throw redirect("/dashboard");
  throw redirect("/login");
}

export default function Landing() {
  return null;
}
