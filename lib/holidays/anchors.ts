// ---------------------------------------------------------------------------
// Anchor functions: return the canonical Date for each holiday in a given year
// ---------------------------------------------------------------------------

/**
 * Easter Sunday via the Anonymous Gregorian algorithm.
 * Accurate for all years in the Gregorian calendar (1583–9999).
 */
export function easterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1 // 0-indexed
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

/**
 * Returns the Nth occurrence of a given weekday in a month.
 *
 * @param year      Full calendar year
 * @param month     0-indexed month (0 = January)
 * @param dayOfWeek 0=Sunday, 1=Monday, …, 6=Saturday
 * @param n         1-indexed occurrence; use -1 for the LAST occurrence
 */
export function nthWeekdayOfMonth(
  year: number,
  month: number,
  dayOfWeek: number,
  n: number,
): Date {
  if (n === -1) {
    // Walk back from the last day of the month
    const lastDay = new Date(year, month + 1, 0)
    const diff = (lastDay.getDay() - dayOfWeek + 7) % 7
    return new Date(year, month, lastDay.getDate() - diff)
  }

  const firstOfMonth = new Date(year, month, 1)
  const firstDow = firstOfMonth.getDay()
  const daysUntilFirst = (dayOfWeek - firstDow + 7) % 7
  return new Date(year, month, 1 + daysUntilFirst + (n - 1) * 7)
}
