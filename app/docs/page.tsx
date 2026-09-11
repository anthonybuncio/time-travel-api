import Link from "next/link";
import type { Metadata } from "next";
import { HOLIDAYS } from "@/lib/holidays/registry";

export const metadata: Metadata = {
  title: "Documentation - Time Travel API",
  description: "API reference for the Time Travel API comparable-date endpoints.",
};

const NAV = [
  { href: "#overview", label: "Overview" },
  { href: "#date", label: "POST /date" },
  { href: "#week", label: "POST /week" },
  { href: "#range", label: "POST /range" },
  { href: "#errors", label: "Errors" },
  { href: "#holidays", label: "Holidays" },
];

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-panel p-4 font-mono text-xs leading-relaxed text-foreground sm:text-sm">
      <code>{children}</code>
    </pre>
  );
}

function Field({
  name,
  type,
  children,
}: {
  name: string;
  type: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:gap-4">
      <div className="shrink-0 font-mono text-sm text-foreground sm:w-40">
        {name}
        <span className="ml-2 text-xs text-accent">{type}</span>
      </div>
      <p className="text-sm text-muted">{children}</p>
    </div>
  );
}

function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string;
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-14 first:border-t-0 first:pt-0">
      <p className="font-mono text-xs tracking-wide text-muted uppercase">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6 flex flex-col gap-6">{children}</div>
    </section>
  );
}

export default function DocsPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-16 sm:py-24">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          &larr; Time Travel API
        </Link>
        <span className="font-mono text-xs text-muted">Documentation</span>
      </div>

      <h1 className="mt-8 text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
        Documentation
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">
        Holiday-aware date mapping across years &mdash; three endpoints, one
        resolution engine.
      </p>

      <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-y border-border py-4 font-mono text-xs text-muted">
        {NAV.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="transition-colors hover:text-accent"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <Section id="overview" eyebrow="01 / Overview" title="Conventions">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-border bg-panel p-5 font-mono text-sm sm:grid-cols-4">
          <div>
            <div className="text-xs text-muted">Base path</div>
            <div className="mt-1 text-foreground">/api/comparable</div>
          </div>
          <div>
            <div className="text-xs text-muted">Methods</div>
            <div className="mt-1 text-foreground">POST</div>
          </div>
          <div>
            <div className="text-xs text-muted">Format</div>
            <div className="mt-1 text-foreground">application/json</div>
          </div>
          <div>
            <div className="text-xs text-muted">Auth</div>
            <div className="mt-1 text-foreground">None</div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground">Endpoints</h3>
          <div className="mt-3 flex flex-col">
            {[
              { path: "/api/comparable/date", desc: "Map a single date to its comparable date in a target year." },
              { path: "/api/comparable/week", desc: "Map a Sun–Sat week to the comparable week in a target year." },
              { path: "/api/comparable/range", desc: "Map a date range (max 366 days) to the comparable range in a target year." },
            ].map((ep) => (
              <div
                key={ep.path}
                className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-4"
              >
                <span className="shrink-0 rounded bg-foreground px-1.5 py-0.5 font-mono text-xs font-semibold text-background sm:w-14 sm:text-center">
                  POST
                </span>
                <span className="shrink-0 font-mono text-sm text-foreground sm:w-56">
                  {ep.path}
                </span>
                <span className="text-sm text-muted">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground">Resolution methods</h3>
          <p className="mt-2 text-sm text-muted">
            Every response reports how the comparable date was derived:
          </p>
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <span className="mt-0.5 shrink-0 rounded border border-accent bg-accent/10 px-2 py-0.5 font-mono text-xs font-semibold text-accent">
                holiday-window
              </span>
              <p className="text-sm text-muted">
                The input date falls within a registered holiday&rsquo;s window.
                The comparable date preserves the same offset from that
                holiday&rsquo;s anchor in the target year.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-0.5 shrink-0 rounded border border-border bg-border/40 px-2 py-0.5 font-mono text-xs font-semibold text-foreground">
                iso-week-fallback
              </span>
              <p className="text-sm text-muted">
                No holiday claims the date. The comparable date falls on the
                same ISO week number and day-of-week in the target year.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section id="date" eyebrow="02 / POST /api/comparable/date" title="Map a single date">
        <p className="text-sm text-muted">
          Maps a single calendar date to its holiday-aware comparable date in
          a target year.
        </p>

        <div>
          <h3 className="text-sm font-medium text-foreground">Request body</h3>
          <div className="mt-2 rounded-lg border border-border bg-panel px-5">
            <Field name="date" type="string">
              YYYY-MM-DD &mdash; the date to map.
            </Field>
            <Field name="targetYear" type="number">
              Calendar year to map into (1900–2100).
            </Field>
            <Field name="windowDays" type="number?">
              Override per-holiday window defaults (0–365).
            </Field>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground">Example</h3>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <Code>{`POST /api/comparable/date

{
  "date": "2024-11-28",
  "targetYear": 2026
}`}</Code>
            <Code>{`200 OK

{
  "inputDate": "2024-11-28",
  "targetYear": 2026,
  "comparableDate": "2026-11-26",
  "method": "holiday-window",
  "holiday": {
    "id": "thanksgiving",
    "name": "Thanksgiving",
    "anchorDate": "2024-11-28",
    "offset": 0,
    "targetAnchorDate": "2026-11-26"
  }
}`}</Code>
          </div>
        </div>
      </Section>

      <Section id="week" eyebrow="03 / POST /api/comparable/week" title="Map a business week">
        <p className="text-sm text-muted">
          Maps a Sun&ndash;Sat business week to its comparable week in a
          target year. Provide any date within the desired week; the engine
          snaps to the Sunday that opens the week, resolves it (holiday-window
          or ISO-week fallback), then extends the result +6 days.
        </p>

        <div>
          <h3 className="text-sm font-medium text-foreground">Request body</h3>
          <div className="mt-2 rounded-lg border border-border bg-panel px-5">
            <Field name="weekOf" type="string">
              YYYY-MM-DD &mdash; any date within the week of interest.
            </Field>
            <Field name="targetYear" type="number">
              Calendar year to map into (1900–2100).
            </Field>
            <Field name="windowDays" type="number?">
              Override per-holiday window defaults (0–365).
            </Field>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground">Example</h3>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <Code>{`POST /api/comparable/week

{
  "weekOf": "2024-11-27",
  "targetYear": 2026
}`}</Code>
            <Code>{`200 OK

{
  "inputWeek": {
    "startDate": "2024-11-24",
    "endDate": "2024-11-30"
  },
  "targetYear": 2026,
  "comparableWeek": {
    "startDate": "2026-11-22",
    "endDate": "2026-11-28"
  },
  "method": "iso-week-fallback",
  "isoWeek": {
    "isoWeekYear": 2024,
    "week": 48,
    "dayOfWeek": 7
  }
}`}</Code>
          </div>
        </div>
      </Section>

      <Section id="range" eyebrow="04 / POST /api/comparable/range" title="Map a date range">
        <p className="text-sm text-muted">
          Maps a date range to its comparable range in a target year, day by
          day. Maximum range: 366 days. A per-day breakdown is included
          automatically for ranges &le; 14 days; set{" "}
          <code className="rounded bg-panel px-1 py-0.5 font-mono text-xs text-foreground">
            includeDays: true
          </code>{" "}
          to force it for longer ranges.
        </p>

        <div>
          <h3 className="text-sm font-medium text-foreground">Request body</h3>
          <div className="mt-2 rounded-lg border border-border bg-panel px-5">
            <Field name="startDate" type="string">
              YYYY-MM-DD.
            </Field>
            <Field name="endDate" type="string">
              YYYY-MM-DD &mdash; must be on or after startDate.
            </Field>
            <Field name="targetYear" type="number">
              Calendar year to map into (1900–2100).
            </Field>
            <Field name="windowDays" type="number?">
              Override per-holiday window defaults (0–365).
            </Field>
            <Field name="includeDays" type="boolean?">
              Force the per-day breakdown in the response. Defaults to auto
              based on range length.
            </Field>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground">Example</h3>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <Code>{`POST /api/comparable/range

{
  "startDate": "2024-11-27",
  "endDate": "2024-11-29",
  "targetYear": 2026
}`}</Code>
            <Code>{`200 OK

{
  "inputRange": {
    "startDate": "2024-11-27",
    "endDate": "2024-11-29"
  },
  "targetYear": 2026,
  "comparableRange": {
    "startDate": "2026-11-26",
    "endDate": "2026-11-28"
  },
  "days": [
    { "inputDate": "2024-11-27", "...": "..." },
    { "inputDate": "2024-11-28", "...": "..." },
    { "inputDate": "2024-11-29", "...": "..." }
  ]
}`}</Code>
          </div>
          <p className="mt-2 text-xs text-muted">
            Each entry in <code className="font-mono">days</code> has the same
            shape as a <code className="font-mono">/date</code> response.
          </p>
        </div>
      </Section>

      <Section id="errors" eyebrow="05 / Errors" title="Errors &amp; validation">
        <p className="text-sm text-muted">
          Every endpoint returns 400 with the same error shape when a request
          fails validation:
        </p>
        <Code>{`400 Bad Request

{
  "error": "string describing what's wrong"
}`}</Code>

        <div>
          <h3 className="text-sm font-medium text-foreground">Validation rules</h3>
          <div className="mt-2 rounded-lg border border-border bg-panel px-5">
            <Field name="body" type="required">
              Must be valid JSON and a JSON object.
            </Field>
            <Field name="date fields" type="required">
              date / weekOf / startDate / endDate must be strings in
              YYYY-MM-DD format.
            </Field>
            <Field name="targetYear" type="required">
              Must be an integer between 1900 and 2100.
            </Field>
            <Field name="windowDays" type="optional">
              When present, must be an integer between 0 and 365.
            </Field>
            <Field name="endDate" type="range only">
              Must be on or after startDate; the range must not exceed 366
              days.
            </Field>
          </div>
        </div>
      </Section>

      <Section id="holidays" eyebrow="06 / Holiday registry" title="Holiday registry">
        <p className="text-sm text-muted">
          The {HOLIDAYS.length} US holidays checked against every input date.
          The closest holiday whose window &mdash; the request&rsquo;s{" "}
          <code className="font-mono">windowDays</code> override, or else that
          holiday&rsquo;s own default window &mdash; contains the date wins.
          Otherwise the response falls back to matching the same ISO week
          number and day-of-week.
        </p>

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-panel font-mono text-xs text-muted uppercase">
                <th className="px-4 py-2.5 text-left font-medium">Name</th>
                <th className="px-4 py-2.5 text-right font-medium">Window</th>
                <th className="px-4 py-2.5 text-left font-medium">Federal</th>
                <th className="px-4 py-2.5 text-left font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {HOLIDAYS.map((holiday) => (
                <tr key={holiday.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-2.5 text-foreground">{holiday.name}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-foreground">
                    &plusmn;{holiday.defaultWindowDays}
                  </td>
                  <td className={`px-4 py-2.5 ${holiday.federalHoliday ? "text-foreground" : "text-muted"}`}>
                    {holiday.federalHoliday ? "Yes" : "—"}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-xs text-muted">{holiday.holidayType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="mt-14 border-t border-border pt-8 text-center">
        <Link
          href="/"
          className="font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          &larr; Back home
        </Link>
      </div>
    </main>
  );
}
