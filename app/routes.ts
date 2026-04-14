import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
  route("logout", "routes/logout.tsx"),
  layout("routes/dashboard/layout.tsx", [
    route("dashboard", "routes/dashboard/home.tsx"),
    route("dashboard/applications", "routes/dashboard/applications.tsx"),
    route("dashboard/new", "routes/dashboard/new.tsx"),
    route(
      "dashboard/applications/:slug",
      "routes/dashboard/applications.$slug.tsx"
    ),
    route("dashboard/edit/:id", "routes/dashboard/edit.$id.tsx"),
  ]),
] satisfies RouteConfig;
