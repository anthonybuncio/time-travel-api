import { describe, it, expect } from 'vitest'
import {
  findHolidayMatch,
  reconstructFromHoliday,
  getIsoWeekContext,
  isoWeekFallback,
  dateFromIsoWeek,
  toDateString,
  parseDate,
} from '../lib/holidays/resolver'

// ---------------------------------------------------------------------------
// parseDate / toDateString
// ---------------------------------------------------------------------------

describe('parseDate', () => {
  it('parses valid YYYY-MM-DD', () => {
    const d = parseDate('2025-04-20')
    expect(d).not.toBeNull()
    expect(d!.getFullYear()).toBe(2025)
    expect(d!.getMonth()).toBe(3) // April = 3
    expect(d!.getDate()).toBe(20)
  })

  it('returns null for invalid strings', () => {
    expect(parseDate('not-a-date')).toBeNull()
    expect(parseDate('2025-13-01')).toBeNull()
    expect(parseDate('2025-02-30')).toBeNull()
    expect(parseDate('')).toBeNull()
  })
})

describe('toDateString', () => {
  it('formats dates as YYYY-MM-DD without UTC shift', () => {
    expect(toDateString(new Date(2025, 0, 1))).toBe('2025-01-01')
    expect(toDateString(new Date(2025, 11, 31))).toBe('2025-12-31')
  })
})

// ---------------------------------------------------------------------------
// findHolidayMatch — holiday-window cases
// ---------------------------------------------------------------------------

describe('findHolidayMatch', () => {
  it('matches Easter Sunday exactly (offset 0)', () => {
    // Easter 2025 = April 20
    const match = findHolidayMatch(new Date(2025, 3, 20))
    expect(match).not.toBeNull()
    expect(match!.holiday.id).toBe('easter')
    expect(match!.offset).toBe(0)
  })

  it('matches Easter Monday (offset +1)', () => {
    const match = findHolidayMatch(new Date(2025, 3, 21))
    expect(match).not.toBeNull()
    expect(match!.holiday.id).toBe('easter')
    expect(match!.offset).toBe(1)
  })

  it('matches Good Friday (offset −2)', () => {
    const match = findHolidayMatch(new Date(2025, 3, 18))
    expect(match).not.toBeNull()
    expect(match!.holiday.id).toBe('easter')
    expect(match!.offset).toBe(-2)
  })

  it('matches Thanksgiving exactly', () => {
    // Thanksgiving 2025 = Nov 27
    const match = findHolidayMatch(new Date(2025, 10, 27))
    expect(match).not.toBeNull()
    expect(match!.holiday.id).toBe('thanksgiving')
    expect(match!.offset).toBe(0)
  })

  it('matches Black Friday (Thanksgiving +1)', () => {
    const match = findHolidayMatch(new Date(2025, 10, 28))
    expect(match!.holiday.id).toBe('thanksgiving')
    expect(match!.offset).toBe(1)
  })

  it('matches Christmas Day exactly', () => {
    const match = findHolidayMatch(new Date(2025, 11, 25))
    expect(match!.holiday.id).toBe('christmas')
    expect(match!.offset).toBe(0)
  })

  it('prefers Christmas Eve (offset 0) over Christmas (offset −1) on Dec 24', () => {
    const match = findHolidayMatch(new Date(2025, 11, 24))
    expect(match!.holiday.id).toBe('christmas-eve')
    expect(match!.offset).toBe(0)
  })

  it('matches New Year\'s Day on Jan 1', () => {
    const match = findHolidayMatch(new Date(2026, 0, 1))
    expect(match!.holiday.id).toBe('new-years-day')
    expect(match!.offset).toBe(0)
  })

  it('matches New Year\'s Eve on Dec 31 (not New Year\'s Day next year)', () => {
    // Dec 31 is NYE offset 0; Jan 1 next year is offset −1 — NYE should win
    const match = findHolidayMatch(new Date(2025, 11, 31))
    expect(match!.holiday.id).toBe('new-years-eve')
    expect(match!.offset).toBe(0)
  })

  it('handles year-boundary: Jan 2 within New Year\'s Day window', () => {
    // NYD ±3 means Jan 1–4 are all claimed
    const match = findHolidayMatch(new Date(2026, 0, 2))
    expect(match!.holiday.id).toBe('new-years-day')
    expect(match!.offset).toBe(1)
  })

  it('returns null for a mid-year date outside all windows', () => {
    // August 15 — well away from any holiday
    const match = findHolidayMatch(new Date(2025, 7, 15))
    expect(match).toBeNull()
  })

  it('respects windowDays override (tighter window excludes border dates)', () => {
    // Easter 2025 = Apr 20; Palm Sunday (Apr 13) is −7 days
    // Default window is 10, so it would be included
    const withDefault = findHolidayMatch(new Date(2025, 3, 13))
    expect(withDefault!.holiday.id).toBe('easter')

    // Override to 3: Apr 13 is outside the window
    const withOverride = findHolidayMatch(new Date(2025, 3, 13), 3)
    expect(withOverride?.holiday.id).not.toBe('easter')
  })

  it('respects windowDays override (wider window claims more dates)', () => {
    // Aug 15 is normally outside all windows
    const withDefault = findHolidayMatch(new Date(2025, 7, 15))
    expect(withDefault).toBeNull()

    // With a huge window of 100, Independence Day (Jul 4) or Labor Day (Sep 1)
    // might claim it — the closer one wins
    const withWide = findHolidayMatch(new Date(2025, 7, 15), 100)
    expect(withWide).not.toBeNull()
  })
})

// ---------------------------------------------------------------------------
// reconstructFromHoliday
// ---------------------------------------------------------------------------

describe('reconstructFromHoliday', () => {
  it('maps Easter Sunday 2025 → Easter Sunday 2024', () => {
    const match = findHolidayMatch(new Date(2025, 3, 20))! // Easter Sunday
    const { comparableDate } = reconstructFromHoliday(match, 2024)
    expect(toDateString(comparableDate)).toBe('2024-03-31') // Easter 2024
  })

  it('maps Easter Monday+1 2025 → Easter Monday+1 2024', () => {
    const match = findHolidayMatch(new Date(2025, 3, 21))! // Easter +1
    const { comparableDate } = reconstructFromHoliday(match, 2024)
    expect(toDateString(comparableDate)).toBe('2024-04-01') // Easter 2024 +1
  })

  it('maps Thanksgiving 2025 → Thanksgiving 2024', () => {
    const match = findHolidayMatch(new Date(2025, 10, 27))! // TG 2025
    const { comparableDate } = reconstructFromHoliday(match, 2024)
    expect(toDateString(comparableDate)).toBe('2024-11-28') // TG 2024
  })

  it('maps Black Friday 2025 → Black Friday 2024', () => {
    const match = findHolidayMatch(new Date(2025, 10, 28))! // BF 2025
    const { comparableDate } = reconstructFromHoliday(match, 2024)
    expect(toDateString(comparableDate)).toBe('2024-11-29') // BF 2024
  })
})

// ---------------------------------------------------------------------------
// ISO-week utilities
// ---------------------------------------------------------------------------

describe('getIsoWeekContext', () => {
  it('returns correct ISO week data for a known date', () => {
    // 2025-04-14 is ISO week 16, Monday, isoWeekYear 2025
    const ctx = getIsoWeekContext(new Date(2025, 3, 14))
    expect(ctx.isoWeekYear).toBe(2025)
    expect(ctx.week).toBe(16)
    expect(ctx.dayOfWeek).toBe(1) // Monday
  })

  it('handles year-boundary: Dec 29 2025 is in ISO week 1 of 2026', () => {
    const ctx = getIsoWeekContext(new Date(2025, 11, 29))
    expect(ctx.isoWeekYear).toBe(2026)
    expect(ctx.week).toBe(1)
    expect(ctx.dayOfWeek).toBe(1) // Monday
  })
})

describe('dateFromIsoWeek', () => {
  it('reconstructs 2025 week 16 Monday', () => {
    const d = dateFromIsoWeek(2025, 16, 1)
    expect(toDateString(d)).toBe('2025-04-14')
  })

  it('reconstructs 2024 week 1 Monday', () => {
    const d = dateFromIsoWeek(2024, 1, 1)
    expect(toDateString(d)).toBe('2024-01-01')
  })
})

describe('isoWeekFallback', () => {
  it('maps a non-holiday Wednesday to the same week/day in the prior year', () => {
    // 2025-08-13 = Wednesday, ISO week 33, 2025
    const result = isoWeekFallback(new Date(2025, 7, 13), 2024)
    // 2024 ISO week 33 Wednesday
    expect(toDateString(result)).toBe('2024-08-14')
  })
})
