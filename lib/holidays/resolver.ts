// ---------------------------------------------------------------------------
// Core resolution logic
// ---------------------------------------------------------------------------
// Given any input date, the resolver:
//   1. Scans all registered holidays (including adjacent-year anchors for
//      year-boundary dates like Dec 31 / Jan 1).
//   2. Returns the closest holiday whose window contains the input date.
//   3. Falls back to ISO-week + day-of-week if no holiday claims the date.

import {
  addDays,
  getISODay,
  getISOWeek,
  getISOWeekYear,
  startOfWeek,
  endOfWeek,
} from 'date-fns'
import { HOLIDAYS } from './registry'
import type {
  HolidayDefinition,
  HolidayMatch,
  IsoWeekContext,
} from './types'

// ---------------------------------------------------------------------------
// Internal utilities
// ---------------------------------------------------------------------------

/** Days between two local dates (b − a), ignoring time-of-day. */
function daysDiff(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((utcB - utcA) / 86_400_000)
}

/** Render a local Date as a YYYY-MM-DD string without UTC conversion. */
export function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parse a YYYY-MM-DD string into a local Date. Returns null if invalid. */
export function parseDate(s: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s)
  if (!match) return null
  const [, y, m, d] = match.map(Number)
  const date = new Date(y, m - 1, d)
  // Guard against JavaScript's overflow (e.g. Feb 30)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null
  }
  return date
}

// ---------------------------------------------------------------------------
// Holiday matching
// ---------------------------------------------------------------------------

/**
 * Find the closest holiday that "claims" the given date.
 *
 * We check the holiday anchors for the date's own year plus one year in each
 * direction. This handles edge cases where, for example, Jan 2 is within
 * New Year's Day's window (anchor = Jan 1 of the same year, offset = +1) and
 * Dec 31 is within New Year's Day's window for the *next* year (offset = −1).
 *
 * If multiple holidays claim the same date, the one with the smallest absolute
 * offset wins. Ties are broken by registry order (earlier = higher priority).
 *
 * @param windowDaysOverride  When provided, overrides each holiday's
 *                            defaultWindowDays for this call.
 */
export function findHolidayMatch(
  date: Date,
  windowDaysOverride?: number,
): HolidayMatch | null {
  const year = date.getFullYear()
  let best: HolidayMatch | null = null
  let bestAbs = Infinity

  for (const yearOffset of [0, -1, 1]) {
    const anchorYear = year + yearOffset

    for (const holiday of HOLIDAYS) {
      const anchorDate = holiday.anchor(anchorYear)
      const offset = daysDiff(anchorDate, date)
      const window = windowDaysOverride ?? holiday.defaultWindowDays

      if (Math.abs(offset) <= window && Math.abs(offset) < bestAbs) {
        bestAbs = Math.abs(offset)
        best = { holiday, anchorDate, offset }
      }
    }
  }

  return best
}

// ---------------------------------------------------------------------------
// Comparable date reconstruction
// ---------------------------------------------------------------------------

/**
 * Given a holiday match and a target year, reconstruct the equivalent date.
 *
 * The equivalent date is: anchor(targetYear) + offset
 *
 * For example, Easter Sunday 2025 (offset 0) → Easter Sunday 2024.
 * Easter Monday+1 2025 (offset 1) → Easter Monday+1 2024.
 */
export function reconstructFromHoliday(
  match: HolidayMatch,
  targetYear: number,
): { comparableDate: Date; targetAnchorDate: Date } {
  const targetAnchorDate = match.holiday.anchor(targetYear)
  const comparableDate = addDays(targetAnchorDate, match.offset)
  return { comparableDate, targetAnchorDate }
}

// ---------------------------------------------------------------------------
// ISO-week fallback
// ---------------------------------------------------------------------------

/**
 * Returns the ISO-week context for a date: (isoWeekYear, week, dayOfWeek).
 * dayOfWeek follows ISO convention: 1=Monday, 7=Sunday.
 */
export function getIsoWeekContext(date: Date): IsoWeekContext {
  return {
    isoWeekYear: getISOWeekYear(date),
    week: getISOWeek(date),
    dayOfWeek: getISODay(date),
  }
}

/**
 * Construct the date for a given (targetIsoWeekYear, isoWeek, dayOfWeek).
 *
 * Algorithm:
 *   - Jan 4 of any year is always in ISO week 1 of that year.
 *   - Find the Monday of week 1 by walking back to the preceding Monday.
 *   - Add (isoWeek − 1) weeks, then add (dayOfWeek − 1) days.
 */
export function dateFromIsoWeek(
  isoWeekYear: number,
  isoWeek: number,
  dayOfWeek: number,
): Date {
  // Monday of ISO week 1
  const jan4 = new Date(isoWeekYear, 0, 4)
  const jan4Iso = getISODay(jan4) // 1=Mon…7=Sun
  const mondayOfWeek1 = addDays(jan4, 1 - jan4Iso)

  // Advance to the target week and day
  return addDays(mondayOfWeek1, (isoWeek - 1) * 7 + (dayOfWeek - 1))
}

/**
 * ISO-week fallback: maps a date to the same (isoWeek, dayOfWeek) in
 * targetYear, treating targetYear as the ISO week year.
 *
 * Edge case: if the computed isoWeek doesn't exist in targetYear (week 53 in a
 * 52-week year), the result will land in ISO week 1 of targetYear+1. Callers
 * that need to guarantee the result stays in targetYear should check this.
 */
export function isoWeekFallback(date: Date, targetYear: number): Date {
  const { week, dayOfWeek } = getIsoWeekContext(date)
  return dateFromIsoWeek(targetYear, week, dayOfWeek)
}

// ---------------------------------------------------------------------------
// Week helpers (Sun–Sat)
// ---------------------------------------------------------------------------

const SUN_START = { weekStartsOn: 0 as const }

/** Sunday that starts the Sun–Sat week containing `date`. */
export function weekStart(date: Date): Date {
  return startOfWeek(date, SUN_START)
}

/** Saturday that ends the Sun–Sat week containing `date`. */
export function weekEnd(date: Date): Date {
  return endOfWeek(date, SUN_START)
}

// ---------------------------------------------------------------------------
// Re-export registry for consumers that need to enumerate holidays
// ---------------------------------------------------------------------------

export { HOLIDAYS }
export type { HolidayDefinition }
