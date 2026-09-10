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
    federalHoliday: true,
    holidayType: 'fixed',
  },
  {
    // 3rd Monday of January
    id: 'mlk-day',
    name: 'MLK Day',
    anchor: (y) => nthWeekdayOfMonth(y, 0, 1, 3),
    defaultWindowDays: 2,
    federalHoliday: true,
    holidayType: 'floating',
  },
  {
    id: 'valentines-day',
    name: "Valentine's Day",
    anchor: (y) => new Date(y, 1, 14),
    defaultWindowDays: 2,
    federalHoliday: false,
    holidayType: 'fixed',
  },
  {
    // 3rd Monday of February
    id: 'presidents-day',
    name: "Presidents' Day",
    anchor: (y) => nthWeekdayOfMonth(y, 1, 1, 3),
    defaultWindowDays: 2,
    federalHoliday: true,
    holidayType: 'floating',
  },
  {
    id: 'st-patricks-day',
    name: "St. Patrick's Day",
    anchor: (y) => new Date(y, 2, 17),
    defaultWindowDays: 2,
    federalHoliday: false,
    holidayType: 'fixed',
  },
  {
    id: 'easter',
    name: 'Easter',
    anchor: easterSunday,
    defaultWindowDays: 10,
    federalHoliday: false,
    holidayType: 'floating',
  },
  {
    id: 'tax-day',
    name: 'Tax Day',
    anchor: (y) => new Date(y, 3, 15),
    defaultWindowDays: 2,
    federalHoliday: false,
    holidayType: 'fixed',
  },
  {
    // 2nd Sunday of May
    id: 'mothers-day',
    name: "Mother's Day",
    anchor: (y) => nthWeekdayOfMonth(y, 4, 0, 2),
    defaultWindowDays: 2,
    federalHoliday: false,
    holidayType: 'floating',
  },
  {
    // Last Monday of May
    id: 'memorial-day',
    name: 'Memorial Day',
    anchor: (y) => nthWeekdayOfMonth(y, 4, 1, -1),
    defaultWindowDays: 4,
    federalHoliday: true,
    holidayType: 'floating',
  },
  {
    // 3rd Sunday of June
    id: 'fathers-day',
    name: "Father's Day",
    anchor: (y) => nthWeekdayOfMonth(y, 5, 0, 3),
    defaultWindowDays: 2,
    federalHoliday: false,
    holidayType: 'floating',
  },
  {
    id: 'juneteenth',
    name: 'Juneteenth',
    anchor: (y) => new Date(y, 5, 19),
    defaultWindowDays: 2,
    federalHoliday: true,
    holidayType: 'fixed',
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    anchor: (y) => new Date(y, 6, 4),
    defaultWindowDays: 3,
    federalHoliday: true,
    holidayType: 'fixed',
  },
  {
    // 1st Monday of September
    id: 'labor-day',
    name: 'Labor Day',
    anchor: (y) => nthWeekdayOfMonth(y, 8, 1, 1),
    defaultWindowDays: 4,
    federalHoliday: true,
    holidayType: 'floating',
  },
  {
    // 2nd Monday of October
    id: 'columbus-day',
    name: 'Columbus Day',
    anchor: (y) => nthWeekdayOfMonth(y, 9, 1, 2),
    defaultWindowDays: 2,
    federalHoliday: true,
    holidayType: 'floating',
  },
  {
    id: 'halloween',
    name: 'Halloween',
    anchor: (y) => new Date(y, 9, 31),
    defaultWindowDays: 2,
    federalHoliday: false,
    holidayType: 'fixed',
  },
  {
    id: 'veterans-day',
    name: 'Veterans Day',
    anchor: (y) => new Date(y, 10, 11),
    defaultWindowDays: 2,
    federalHoliday: true,
    holidayType: 'fixed',
  },
  {
    // 4th Thursday of November
    id: 'thanksgiving',
    name: 'Thanksgiving',
    anchor: (y) => nthWeekdayOfMonth(y, 10, 4, 4),
    defaultWindowDays: 5,
    federalHoliday: true,
    holidayType: 'floating',
  },
  {
    // Day after Thanksgiving (4th Thursday of November + 1)
    id: 'black-friday',
    name: 'Black Friday',
    anchor: (y) => {
      const thanksgiving = nthWeekdayOfMonth(y, 10, 4, 4)
      return new Date(y, 10, thanksgiving.getDate() + 1)
    },
    defaultWindowDays: 2,
    federalHoliday: false,
    holidayType: 'floating',
  },
  {
    id: 'christmas-eve',
    name: 'Christmas Eve',
    anchor: (y) => new Date(y, 11, 24),
    defaultWindowDays: 2,
    federalHoliday: false,
    holidayType: 'fixed',
  },
  {
    id: 'christmas',
    name: 'Christmas',
    anchor: (y) => new Date(y, 11, 25),
    defaultWindowDays: 4,
    federalHoliday: true,
    holidayType: 'fixed',
  },
  {
    id: 'new-years-eve',
    name: "New Year's Eve",
    anchor: (y) => new Date(y, 11, 31),
    defaultWindowDays: 2,
    federalHoliday: false,
    holidayType: 'fixed',
  },
]
