import { describe, it, expect } from 'vitest'
import { easterSunday, nthWeekdayOfMonth } from '../lib/holidays/anchors'
import { toDateString } from '../lib/holidays/resolver'

describe('easterSunday', () => {
  it('returns known Easter dates', () => {
    // Verified against https://www.timeanddate.com/holidays/us/easter-sunday
    const cases: [number, string][] = [
      [2020, '2020-04-12'],
      [2021, '2021-04-04'],
      [2022, '2022-04-17'],
      [2023, '2023-04-09'],
      [2024, '2024-03-31'],
      [2025, '2025-04-20'],
      [2026, '2026-04-05'],
      [2027, '2027-03-28'],
    ]
    for (const [year, expected] of cases) {
      expect(toDateString(easterSunday(year))).toBe(expected)
    }
  })
})

describe('nthWeekdayOfMonth', () => {
  it('returns Memorial Day (last Monday of May)', () => {
    // Last Monday of May
    expect(toDateString(nthWeekdayOfMonth(2024, 4, 1, -1))).toBe('2024-05-27')
    expect(toDateString(nthWeekdayOfMonth(2025, 4, 1, -1))).toBe('2025-05-26')
    expect(toDateString(nthWeekdayOfMonth(2026, 4, 1, -1))).toBe('2026-05-25')
  })

  it('returns Labor Day (1st Monday of September)', () => {
    expect(toDateString(nthWeekdayOfMonth(2024, 8, 1, 1))).toBe('2024-09-02')
    expect(toDateString(nthWeekdayOfMonth(2025, 8, 1, 1))).toBe('2025-09-01')
    expect(toDateString(nthWeekdayOfMonth(2026, 8, 1, 1))).toBe('2026-09-07')
  })

  it('returns Thanksgiving (4th Thursday of November)', () => {
    expect(toDateString(nthWeekdayOfMonth(2024, 10, 4, 4))).toBe('2024-11-28')
    expect(toDateString(nthWeekdayOfMonth(2025, 10, 4, 4))).toBe('2025-11-27')
    expect(toDateString(nthWeekdayOfMonth(2026, 10, 4, 4))).toBe('2026-11-26')
  })

  it('returns MLK Day (3rd Monday of January)', () => {
    expect(toDateString(nthWeekdayOfMonth(2025, 0, 1, 3))).toBe('2025-01-20')
    expect(toDateString(nthWeekdayOfMonth(2026, 0, 1, 3))).toBe('2026-01-19')
  })

  it('returns Presidents Day (3rd Monday of February)', () => {
    expect(toDateString(nthWeekdayOfMonth(2025, 1, 1, 3))).toBe('2025-02-17')
    expect(toDateString(nthWeekdayOfMonth(2026, 1, 1, 3))).toBe('2026-02-16')
  })

  it("returns Mother's Day (2nd Sunday of May)", () => {
    expect(toDateString(nthWeekdayOfMonth(2025, 4, 0, 2))).toBe('2025-05-11')
    expect(toDateString(nthWeekdayOfMonth(2026, 4, 0, 2))).toBe('2026-05-10')
  })

  it("returns Father's Day (3rd Sunday of June)", () => {
    expect(toDateString(nthWeekdayOfMonth(2025, 5, 0, 3))).toBe('2025-06-15')
    expect(toDateString(nthWeekdayOfMonth(2026, 5, 0, 3))).toBe('2026-06-21')
  })
})
