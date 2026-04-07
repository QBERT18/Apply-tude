export function Footer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 h-16 border-t bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-full max-w-5xl items-center justify-center px-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Apply-tude
      </div>
    </footer>
  );
}
