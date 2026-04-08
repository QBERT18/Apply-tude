import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("new", "routes/new.tsx"),
    route("applications/:slug", "routes/applications.$slug.tsx"),
    route("edit/:id", "routes/edit.$id.tsx"),
  ]),
] satisfies RouteConfig;
