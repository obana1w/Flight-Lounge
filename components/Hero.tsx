import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-center">
      <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground">
        Слушайте авиационные переговоры
        <br />
        в реальном времени
      </h1>

      <p className="mb-8 text-lg text-muted">
        Москва • Санкт-Петербург • Новосибирск
      </p>

      <button className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-primary to-secondary px-6 py-3 font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30">
        Начать слушать
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
      </button>
    </section>
  );
}
