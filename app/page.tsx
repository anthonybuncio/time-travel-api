import Image from "next/image";

export default function Home() {
  return (
    <main className="hero-glow relative flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/time-machine.svg"
          alt=""
          width={200}
          height={193}
          priority
          className="icon-glow materialize h-24 w-24 sm:h-30 sm:w-30`"
        />

        <h1 className="materialize materialize-delay-1 mt-10 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          Time Travel API
        </h1>
        <p className="materialize materialize-delay-1 mt-4 max-w-xs text-lg text-muted sm:max-w-sm sm:text-xl">
          Holiday-aware date mapping across years.
        </p>
        <p className="materialize materialize-delay-1 mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted sm:max-w-lg sm:text-base">
          Time Travel API gives you the correct comparable date, automatically.
          Built for QSR, retail, and any business where holidays drive traffic
          patterns. Drop it into your existing reporting stack and get comps you
          can actually trust.
        </p>

        <div className="materialize materialize-delay-2 mt-14 flex items-center gap-5 rounded-lg border border-border bg-panel px-6 py-5 font-mono text-sm text-foreground sm:gap-7 sm:px-8 sm:text-base">
          <div className="flex flex-col items-center gap-1.5">
            <span>2024-11-28</span>
            <span className="text-xs text-muted">Thanksgiving</span>
          </div>
          <span aria-hidden className="text-xl text-accent">
            &rarr;
          </span>
          <div className="flex flex-col items-center gap-1.5">
            <span>2026-11-26</span>
            <span className="text-xs text-muted">Thanksgiving</span>
          </div>
        </div>

        <p className="materialize materialize-delay-3 mt-8 font-mono text-xs text-muted">
          POST /api/comparable/date
        </p>

        <a
          href="https://claude.ai/code/artifact/6002ceff-353a-485b-a53c-62baac6c5151"
          target="_blank"
          rel="noopener noreferrer"
          className="materialize materialize-delay-4 mt-10 rounded-lg border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Documentation
        </a>
      </div>
    </main>
  );
}
