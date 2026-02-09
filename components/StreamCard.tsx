import { Plane, ArrowRight, Circle } from "lucide-react";

interface StreamCardProps {
  code: string;
  city: string;
  listeners: number;
  isLive: boolean;
}

export function StreamCard({ code, city, listeners, isLive }: StreamCardProps) {
  return (
    <div className="group cursor-pointer rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-2xl hover:shadow-black/30">
      <div className="mb-6 flex justify-center">
        <Plane className="h-10 w-10 text-primary" strokeWidth={1.5} />
      </div>

      <h3 className="mb-2 text-center text-xl font-bold text-foreground">
        {code}
      </h3>

      <p className="mb-6 text-center text-sm text-muted">
        {city}
      </p>

      <div className="mb-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted">
          <Circle className="h-2 w-2 fill-current" />
          <span>{listeners}</span>
        </div>

        {isLive && (
          <div className="flex items-center gap-2 text-success">
            <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="font-medium">Live</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary transition-colors group-hover:text-secondary">
        Слушать
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </div>
    </div>
  );
}
