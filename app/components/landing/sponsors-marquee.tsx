const sponsors = [
  { name: "Clerk", src: "/sponsors/clerk.svg" },
  { name: "Crowdin", src: "/sponsors/crowdin.svg" },
  { name: "Sentry", src: "/sponsors/sentry.svg" },
  { name: "Arcjet", src: "/sponsors/arcjet.svg" },
  { name: "Novu", src: "/sponsors/novu.svg" },
  { name: "Turso", src: "/sponsors/turso.svg" },
  { name: "Keyloop", src: "/sponsors/keyloop.svg" },
  { name: "Storyblok", src: "/sponsors/storyblok.svg" },
];

function LogoList() {
  return (
    <>
      {sponsors.map((sponsor) => (
        <img
          key={sponsor.name}
          src={sponsor.src}
          alt={sponsor.name}
          className="h-10 w-auto shrink-0 opacity-50 grayscale"
        />
      ))}
    </>
  );
}

export function SponsorsMarquee() {
  return (
    <section className="space-y-8 pt-12 pb-32">
      <p className="text-center text-lg italic text-muted-foreground">
        Sponsored by
      </p>
      <div className="relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-24 before:bg-linear-to-r before:from-background before:to-transparent after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-24 after:bg-linear-to-l after:from-background after:to-transparent">
        <div className="flex w-max animate-marquee items-center gap-16">
          <LogoList />
          <LogoList />
        </div>
      </div>
    </section>
  );
}
