import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="hero-glow relative flex min-h-screen flex-1 flex-col items-center justify-center px-6 py-24">
      <a
        href="https://github.com/anthonybuncio/time-travel-api"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View anthonybuncio on GitHub"
        className="group fixed top-0 right-0 z-20 h-36 w-36 overflow-hidden"
      >
        <span
          aria-hidden
          className="absolute top-8 -right-10 flex w-42.5 items-center justify-center gap-2 rotate-45 border-y border-border bg-panel py-1.5 text-foreground shadow-md transition-colors group-hover:border-accent group-hover:text-accent"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span className="font-mono text-xs">GitHub</span>
        </span>
      </a>

      <div className="flex flex-col items-center text-center">
        <Image
          src="/time-machine.svg"
          alt=""
          width={200}
          height={193}
          priority
          className="icon-glow materialize h-24 w-24 sm:h-30 sm:w-30"
        />

        <h1 className="materialize materialize-delay-1 mt-10 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          TimeTravel API
        </h1>
        <p className="materialize materialize-delay-1 mt-4 max-w-xs text-lg text-muted sm:max-w-sm sm:text-xl">
          A business focused date mapping API across previous years.
        </p>
        <p className="materialize materialize-delay-1 mx-auto mt-6 max-w-md text-sm leading-relaxed text-muted sm:max-w-xl sm:text-base">
          TimeTravel API gives you the correct comparable date, automatically.
          Built for QSR, retail, and any business where holidays drive traffic
          patterns. Drop it into your existing reporting stack and get comps you
          can actually trust.
        </p>

        <div className="materialize materialize-delay-2 mt-14 flex flex-col items-center gap-4 rounded-lg border border-border bg-panel px-6 py-5 font-mono text-sm text-foreground sm:flex-row sm:gap-7 sm:px-8 sm:text-base">
          <div className="flex flex-col items-center gap-1.5">
            <span>2026-11-26</span>
            <span className="text-xs text-muted">Thanksgiving 🍗</span>
          </div>

          <span
            aria-hidden
            className="rotate-90 text-xl text-accent sm:rotate-0"
          >
            &rarr;
          </span>
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
              <span>2025-11-27</span>
              {/* <span className="text-xs text-muted">Thanksgiving</span> */}
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <span>2024-11-28</span>
              {/* <span className="text-xs text-muted">Thanksgiving</span> */}
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <span>2023-11-23</span>
              {/* <span className="text-xs text-muted">Thanksgiving</span> */}
            </div>
          </div>
        </div>

        <p className="materialize materialize-delay-3 mt-8 font-mono text-xs text-muted">
          POST /api/comparable/date
        </p>

        <Link
          href="/docs"
          className="materialize materialize-delay-4 mt-10 rounded-lg border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
