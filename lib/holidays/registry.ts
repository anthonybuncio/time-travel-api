// ---------------------------------------------------------------------------
// Holiday registry — ordered chronologically through the year
// ---------------------------------------------------------------------------
// Window defaults are tuned for QSR sales impact:
//   - Long weekends (Memorial Day, Labor Day): ±4 days
//   - Easter: ±10 days (extended shopping / dining window)
//   - Thanksgiving: ±5 days (week-of impact)
//   - Christmas: ±4 days
//   - Most other holidays: ±2–3 days

import { easterSunday, nthWeekdayOfMonth } from './anchors'
import type { HolidayDefinition } from './types'

export const HOLIDAYS: HolidayDefinition[] = [
  {
    id: 'new-years-day',
    name: "New Year's Day",
    anchor: (y) => new Date(y, 0, 1),
    defaultWindowDays: 3,
  },
  {
    // 3rd Monday of January
    id: 'mlk-day',
    name: 'MLK Day',
    anchor: (y) => nthWeekdayOfMonth(y, 0, 1, 3),
    defaultWindowDays: 2,
  },
  {
    id: 'valentines-day',
    name: "Valentine's Day",
    anchor: (y) => new Date(y, 1, 14),
    defaultWindowDays: 2,
  },
  {
    // 3rd Monday of February
    id: 'presidents-day',
    name: "Presidents' Day",
    anchor: (y) => nthWeekdayOfMonth(y, 1, 1, 3),
    defaultWindowDays: 2,
  },
  {
    id: 'easter',
    name: 'Easter',
    anchor: easterSunday,
    defaultWindowDays: 10,
  },
  {
    // 2nd Sunday of May
    id: 'mothers-day',
    name: "Mother's Day",
    anchor: (y) => nthWeekdayOfMonth(y, 4, 0, 2),
    defaultWindowDays: 2,
  },
  {
    // Last Monday of May
    id: 'memorial-day',
    name: 'Memorial Day',
    anchor: (y) => nthWeekdayOfMonth(y, 4, 1, -1),
    defaultWindowDays: 4,
  },
  {
    // 3rd Sunday of June
    id: 'fathers-day',
    name: "Father's Day",
    anchor: (y) => nthWeekdayOfMonth(y, 5, 0, 3),
    defaultWindowDays: 2,
  },
  {
    id: 'juneteenth',
    name: 'Juneteenth',
    anchor: (y) => new Date(y, 5, 19),
    defaultWindowDays: 2,
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    anchor: (y) => new Date(y, 6, 4),
    defaultWindowDays: 3,
  },
  {
    // 1st Monday of September
    id: 'labor-day',
    name: 'Labor Day',
    anchor: (y) => nthWeekdayOfMonth(y, 8, 1, 1),
    defaultWindowDays: 4,
  },
  {
    // 2nd Monday of October
    id: 'columbus-day',
    name: 'Columbus Day',
    anchor: (y) => nthWeekdayOfMonth(y, 9, 1, 2),
    defaultWindowDays: 2,
  },
  {
    id: 'halloween',
    name: 'Halloween',
    anchor: (y) => new Date(y, 9, 31),
    defaultWindowDays: 2,
  },
  {
    id: 'veterans-day',
    name: 'Veterans Day',
    anchor: (y) => new Date(y, 10, 11),
    defaultWindowDays: 2,
  },
  {
    // 4th Thursday of November
    id: 'thanksgiving',
    name: 'Thanksgiving',
    anchor: (y) => nthWeekdayOfMonth(y, 10, 4, 4),
    defaultWindowDays: 5,
  },
  {
    id: 'christmas-eve',
    name: 'Christmas Eve',
    anchor: (y) => new Date(y, 11, 24),
    defaultWindowDays: 2,
  },
  {
    id: 'christmas',
    name: 'Christmas',
    anchor: (y) => new Date(y, 11, 25),
    defaultWindowDays: 4,
  },
  {
    id: 'new-years-eve',
    name: "New Year's Eve",
    anchor: (y) => new Date(y, 11, 31),
    defaultWindowDays: 2,
  },
]
