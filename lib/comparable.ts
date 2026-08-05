// ---------------------------------------------------------------------------
// Public API for the comparable-date engine
// Three modes: single date, Sun–Sat week, date range
// ---------------------------------------------------------------------------

import { addDays, eachDayOfInterval } from 'date-fns'
import {
  findHolidayMatch,
  reconstructFromHoliday,
  getIsoWeekContext,
  isoWeekFallback,
  weekStart,
  weekEnd,
  toDateString,
  parseDate,
} from './holidays/resolver'
import type {
  DateComparableRequest,
  DateComparableResult,
  WeekComparableRequest,
  WeekComparableResult,
  RangeComparableRequest,
  RangeComparableResult,
  DayEntry,
  ApiError,
} from './holidays/types'

// ---------------------------------------------------------------------------
// Shared validation
// ---------------------------------------------------------------------------

function validateYear(targetYear: unknown): string | null {
  if (
    typeof targetYear !== 'number' ||
    !Number.isInteger(targetYear) ||
    targetYear < 1900 ||
    targetYear > 2100
  ) {
    return 'targetYear must be an integer between 1900 and 2100'
  }
  return null
}

function validateWindowDays(windowDays: unknown): string | null {
  if (windowDays === undefined) return null
  if (
    typeof windowDays !== 'number' ||
    !Number.isInteger(windowDays) ||
    windowDays < 0 ||
    windowDays > 365
  ) {
    return 'windowDays must be an integer between 0 and 365'
  }
  return null
}

// ---------------------------------------------------------------------------
// Single-date resolution
// ---------------------------------------------------------------------------

function resolveOne(
  date: Date,
  targetYear: number,
  windowDays?: number,
): DateComparableResult {
  const inputStr = toDateString(date)
  const match = findHolidayMatch(date, windowDays)

  if (match) {
    const { comparableDate, targetAnchorDate } = reconstructFromHoliday(
      match,
      targetYear,
    )
    return {
      inputDate: inputStr,
      targetYear,
      comparableDate: toDateString(comparableDate),
      method: 'holiday-window',
      holiday: {
        id: match.holiday.id,
        name: match.holiday.name,
        anchorDate: toDateString(match.anchorDate),
        offset: match.offset,
        targetAnchorDate: toDateString(targetAnchorDate),
      },
    }
  }

  // ISO-week fallback
  const ctx = getIsoWeekContext(date)
  const comparable = isoWeekFallback(date, targetYear)
  return {
    inputDate: inputStr,
    targetYear,
    comparableDate: toDateString(comparable),
    method: 'iso-week-fallback',
    isoWeek: ctx,
  }
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

export function getComparableDate(
  req: DateComparableRequest,
): DateComparableResult | ApiError {
  const yearErr = validateYear(req.targetYear)
  if (yearErr) return { error: yearErr }

  const winErr = validateWindowDays(req.windowDays)
  if (winErr) return { error: winErr }

  const date = parseDate(req.date)
  if (!date) return { error: `Invalid date "${req.date}". Use YYYY-MM-DD.` }

  return resolveOne(date, req.targetYear, req.windowDays)
}

export function getComparableWeek(
  req: WeekComparableRequest,
): WeekComparableResult | ApiError {
  const yearErr = validateYear(req.targetYear)
  if (yearErr) return { error: yearErr }

  const winErr = validateWindowDays(req.windowDays)
  if (winErr) return { error: winErr }

  const anchor = parseDate(req.weekOf)
  if (!anchor) return { error: `Invalid weekOf "${req.weekOf}". Use YYYY-MM-DD.` }

  // Snap to the Sun–Sat week boundaries
  const inputStart = weekStart(anchor)
  const inputEnd = weekEnd(anchor)

  // Resolve the Sunday (week start) to get the comparable week anchor
  const resolved = resolveOne(inputStart, req.targetYear, req.windowDays)

  const comparableStart = parseDate(resolved.comparableDate)!
  const comparableEnd = addDays(comparableStart, 6)

  return {
    inputWeek: {
      startDate: toDateString(inputStart),
      endDate: toDateString(inputEnd),
    },
    targetYear: req.targetYear,
    comparableWeek: {
      startDate: toDateString(comparableStart),
      endDate: toDateString(comparableEnd),
    },
    method: resolved.method,
    ...(resolved.holiday ? { holiday: resolved.holiday } : {}),
    ...(resolved.isoWeek ? { isoWeek: resolved.isoWeek } : {}),
  }
}

export function getComparableRange(
  req: RangeComparableRequest,
): RangeComparableResult | ApiError {
  const yearErr = validateYear(req.targetYear)
  if (yearErr) return { error: yearErr }

  const winErr = validateWindowDays(req.windowDays)
  if (winErr) return { error: winErr }

  const start = parseDate(req.startDate)
  if (!start) return { error: `Invalid startDate "${req.startDate}". Use YYYY-MM-DD.` }

  const end = parseDate(req.endDate)
  if (!end) return { error: `Invalid endDate "${req.endDate}". Use YYYY-MM-DD.` }

  if (end < start) {
    return { error: 'endDate must be on or after startDate.' }
  }

  const days = eachDayOfInterval({ start, end })

  if (days.length > 366) {
    return { error: 'Date range must not exceed 366 days.' }
  }

  const resolved: DayEntry[] = days.map((d) =>
    resolveOne(d, req.targetYear, req.windowDays),
  )

  const comparableStart = parseDate(resolved[0].comparableDate)!
  const comparableEnd = parseDate(resolved[resolved.length - 1].comparableDate)!

  // Include per-day breakdown when explicitly requested, or for short ranges
  const includeDays = req.includeDays ?? days.length <= 14

  return {
    inputRange: {
      startDate: toDateString(start),
      endDate: toDateString(end),
    },
    targetYear: req.targetYear,
    comparableRange: {
      startDate: toDateString(comparableStart),
      endDate: toDateString(comparableEnd),
    },
    ...(includeDays ? { days: resolved } : {}),
  }
}
