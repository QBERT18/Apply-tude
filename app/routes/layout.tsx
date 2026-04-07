import { Outlet } from "react-router";

import { Navbar } from "~/components/layout/navbar";
import { Footer } from "~/components/layout/footer";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto w-full max-w-5xl px-4 pt-8 pb-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
