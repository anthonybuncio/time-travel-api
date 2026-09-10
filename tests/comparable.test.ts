import { describe, it, expect } from 'vitest'
import { getComparableDate, getComparableWeek, getComparableRange } from '../lib/comparable'

// ---------------------------------------------------------------------------
// getComparableDate
// ---------------------------------------------------------------------------

describe('getComparableDate', () => {
  it('maps Easter Sunday 2025 → Easter Sunday 2024 via holiday-window', () => {
    const result = getComparableDate({ date: '2025-04-20', targetYear: 2024 })
    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.comparableDate).toBe('2024-03-31')
    expect(result.method).toBe('holiday-window')
    expect(result.holiday?.id).toBe('easter')
    expect(result.holiday?.offset).toBe(0)
  })

  it('maps Good Friday 2025 → Good Friday 2024', () => {
    // Easter 2025 = Apr 20; Good Friday = Apr 18 (offset −2)
    // Easter 2024 = Mar 31; Good Friday 2024 = Mar 29
    const result = getComparableDate({ date: '2025-04-18', targetYear: 2024 })
    if ('error' in result) return
    expect(result.comparableDate).toBe('2024-03-29')
    expect(result.holiday?.id).toBe('easter')
    expect(result.holiday?.offset).toBe(-2)
  })

  it('maps a non-holiday mid-year date via ISO-week fallback', () => {
    // 2025-08-13 (Wed) — no holiday nearby
    const result = getComparableDate({ date: '2025-08-13', targetYear: 2024 })
    if ('error' in result) return
    expect(result.method).toBe('iso-week-fallback')
    expect(result.comparableDate).toBe('2024-08-14') // same week/day in 2024
  })

  it('maps Thanksgiving 2025 → Thanksgiving 2024', () => {
    const result = getComparableDate({ date: '2025-11-27', targetYear: 2024 })
    if ('error' in result) return
    expect(result.comparableDate).toBe('2024-11-28')
    expect(result.holiday?.id).toBe('thanksgiving')
  })

  it('maps Christmas Day 2025 → Christmas Day 2024', () => {
    const result = getComparableDate({ date: '2025-12-25', targetYear: 2024 })
    if ('error' in result) return
    expect(result.comparableDate).toBe('2024-12-25')
    expect(result.holiday?.id).toBe('christmas')
    expect(result.holiday?.offset).toBe(0)
  })

  it('maps Christmas Day 2025 → Christmas Day 2023 (multi-year gap)', () => {
    const result = getComparableDate({ date: '2025-12-25', targetYear: 2023 })
    if ('error' in result) return
    expect(result.comparableDate).toBe('2023-12-25')
  })

  it('handles Dec 26 (Christmas +1) correctly', () => {
    // Dec 26 is within Christmas ±4; Christmas 2024 = Dec 25; comparable = Dec 26 2024
    const result = getComparableDate({ date: '2025-12-26', targetYear: 2024 })
    if ('error' in result) return
    expect(result.holiday?.id).toBe('christmas')
    expect(result.holiday?.offset).toBe(1)
    expect(result.comparableDate).toBe('2024-12-26')
  })

  it('returns error for invalid date string', () => {
    const result = getComparableDate({ date: 'not-a-date', targetYear: 2024 })
    expect('error' in result).toBe(true)
  })

  it('returns error for out-of-range targetYear', () => {
    const result = getComparableDate({ date: '2025-04-20', targetYear: 1800 })
    expect('error' in result).toBe(true)
  })

  it('respects custom windowDays override', () => {
    // Easter 2025 = Apr 20; Apr 1 is 19 days before — outside default ±10
    const withDefault = getComparableDate({ date: '2025-04-01', targetYear: 2024 })
    if ('error' in withDefault) return
    expect(withDefault.method).not.toBe('holiday-window')

    // At a wide override, Tax Day (Apr 15, −14 days) is closer than Easter
    // (Apr 20, −19 days) and wins
    const withWide = getComparableDate({ date: '2025-04-01', targetYear: 2024, windowDays: 20 })
    if ('error' in withWide) return
    expect(withWide.method).toBe('holiday-window')
    expect(withWide.holiday?.id).toBe('tax-day')
  })
})

// ---------------------------------------------------------------------------
// getComparableWeek
// ---------------------------------------------------------------------------

describe('getComparableWeek', () => {
  it('maps Easter week 2025 (any date in the week) to Easter week 2024', () => {
    // Easter 2025 = April 20 (Sunday). Week = Apr 20–Apr 26.
    // Easter 2024 = March 31 (Sunday). Comparable week = Mar 31–Apr 6.
    const result = getComparableWeek({ weekOf: '2025-04-22', targetYear: 2024 })
    expect('error' in result).toBe(false)
    if ('error' in result) return
    expect(result.inputWeek.startDate).toBe('2025-04-20')
    expect(result.inputWeek.endDate).toBe('2025-04-26')
    expect(result.comparableWeek.startDate).toBe('2024-03-31')
    expect(result.comparableWeek.endDate).toBe('2024-04-06')
    expect(result.method).toBe('holiday-window')
    expect(result.holiday?.id).toBe('easter')
  })

  it('maps a non-holiday week via ISO-week fallback', () => {
    // Week of Aug 10, 2025 = Aug 10 (Sun) – Aug 16 (Sat)
    const result = getComparableWeek({ weekOf: '2025-08-13', targetYear: 2024 })
    if ('error' in result) return
    expect(result.method).toBe('iso-week-fallback')
    // The Sunday of that week (Aug 10, 2025) should map to the same ISO week Sunday in 2024
    expect(result.comparableWeek.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    // Comparable week should be 7 consecutive days
    const start = new Date(result.comparableWeek.startDate)
    const end = new Date(result.comparableWeek.endDate)
    const diffMs = end.getTime() - start.getTime()
    expect(diffMs / 86_400_000).toBe(6)
  })

  it('snaps a Tuesday to the preceding Sunday', () => {
    // 2025-08-12 is a Tuesday; the week should start on Aug 10 (Sunday)
    const result = getComparableWeek({ weekOf: '2025-08-12', targetYear: 2024 })
    if ('error' in result) return
    expect(result.inputWeek.startDate).toBe('2025-08-10')
    expect(result.inputWeek.endDate).toBe('2025-08-16')
  })

  it('returns error for invalid weekOf', () => {
    const result = getComparableWeek({ weekOf: 'bad', targetYear: 2024 })
    expect('error' in result).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// getComparableRange
// ---------------------------------------------------------------------------

describe('getComparableRange', () => {
  it('maps a short range (≤14 days) and includes day breakdown by default', () => {
    const result = getComparableRange({
      startDate: '2025-04-18',
      endDate: '2025-04-22',
      targetYear: 2024,
    })
    expect('error' in result).toBe(false)
    if ('error' in result) return
    // 5 days
    expect(result.days).toHaveLength(5)
    // All days should use easter holiday-window
    for (const day of result.days!) {
      expect(day.method).toBe('holiday-window')
      expect(day.holiday?.id).toBe('easter')
    }
    expect(result.comparableRange.startDate).toBe('2024-03-29') // Easter 2024 −2
    expect(result.comparableRange.endDate).toBe('2024-04-02')   // Easter 2024 +2
  })

  it('omits day breakdown by default for ranges > 14 days', () => {
    const result = getComparableRange({
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      targetYear: 2024,
    })
    if ('error' in result) return
    expect(result.days).toBeUndefined()
  })

  it('includes day breakdown when explicitly requested for long ranges', () => {
    const result = getComparableRange({
      startDate: '2025-04-01',
      endDate: '2025-04-30',
      targetYear: 2024,
      includeDays: true,
    })
    if ('error' in result) return
    expect(result.days).toHaveLength(30)
  })

  it('returns error when endDate is before startDate', () => {
    const result = getComparableRange({
      startDate: '2025-06-01',
      endDate: '2025-05-01',
      targetYear: 2024,
    })
    expect('error' in result).toBe(true)
  })

  it('returns error for ranges > 366 days', () => {
    const result = getComparableRange({
      startDate: '2025-01-01',
      endDate: '2026-06-01',
      targetYear: 2024,
    })
    expect('error' in result).toBe(true)
  })

  it('handles a single-day range', () => {
    const result = getComparableRange({
      startDate: '2025-11-27',
      endDate: '2025-11-27',
      targetYear: 2024,
    })
    if ('error' in result) return
    expect(result.days).toHaveLength(1)
    expect(result.days![0].holiday?.id).toBe('thanksgiving')
    expect(result.comparableRange.startDate).toBe(result.comparableRange.endDate)
  })
})
