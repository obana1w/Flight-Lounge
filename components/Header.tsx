import { Plane } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/60 bg-background/85 backdrop-blur-[20px]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <span className="text-xl font-semibold text-foreground">FlightLounge</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Поиск"
              className="h-10 w-64 rounded-lg border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted transition-colors focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
