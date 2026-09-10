// ---------------------------------------------------------------------------
// Core types for the holiday-aware date comparison engine
// ---------------------------------------------------------------------------

export type HolidayId =
  | 'new-years-day'
  | 'mlk-day'
  | 'valentines-day'
  | 'presidents-day'
  | 'st-patricks-day'
  | 'easter'
  | 'tax-day'
  | 'mothers-day'
  | 'memorial-day'
  | 'fathers-day'
  | 'juneteenth'
  | 'independence-day'
  | 'labor-day'
  | 'columbus-day'
  | 'halloween'
  | 'veterans-day'
  | 'thanksgiving'
  | 'black-friday'
  | 'christmas-eve'
  | 'christmas'
  | 'new-years-eve';

export interface HolidayDefinition {
  id: HolidayId;
  name: string;
  /**
   * Returns the canonical anchor date for the given year.
   * For floating holidays (Easter, Memorial Day, etc.) this varies by year.
   * For fixed-date holidays (Christmas, Independence Day, etc.) this is always the same month/day.
   */
  anchor: (year: number) => Date;
  /**
   * Default window: dates within ±N days of the anchor are "claimed" by this holiday.
   * Can be overridden per-request via the `windowDays` parameter.
   */
  defaultWindowDays: number;
  /** Whether this is one of the eleven official US federal holidays. */
  federalHoliday: boolean;
  /**
   * "fixed" holidays fall on the same month/day every year (e.g. Christmas).
   * "floating" holidays are defined relative to a weekday or another holiday
   * and shift date from year to year (e.g. Thanksgiving, Easter).
   */
  holidayType: 'fixed' | 'floating';
}

export interface HolidayMatch {
  holiday: HolidayDefinition;
  /** Anchor date in the input date's year (or an adjacent year for boundary cases) */
  anchorDate: Date;
  /** inputDate - anchorDate in days; negative = before anchor, positive = after */
  offset: number;
}

export type ComparisonMethod = 'holiday-window' | 'iso-week-fallback';

// ---------------------------------------------------------------------------
// API shape
// ---------------------------------------------------------------------------

export interface DateComparableRequest {
  /** Input date in YYYY-MM-DD format */
  date: string;
  targetYear: number;
  /** Override the per-holiday defaultWindowDays for all holidays in this request */
  windowDays?: number;
}

export interface WeekComparableRequest {
  /**
   * Any date within the desired week; the engine snaps to the Sunday that
   * starts the Sun–Sat week containing this date.
   */
  weekOf: string;
  targetYear: number;
  windowDays?: number;
}

export interface RangeComparableRequest {
  startDate: string;
  endDate: string;
  targetYear: number;
  windowDays?: number;
  /**
   * When true, include a per-day breakdown in the response.
   * Defaults to false for ranges longer than 14 days to keep payloads manageable.
   */
  includeDays?: boolean;
}

// ---------------------------------------------------------------------------
// Response shape
// ---------------------------------------------------------------------------

export interface HolidayContext {
  id: HolidayId;
  name: string;
  /** Anchor date in the input year (ISO string) */
  anchorDate: string;
  /** Days from the anchor to the input date (-N = before, +N = after) */
  offset: number;
  /** Anchor date in the target year (ISO string) */
  targetAnchorDate: string;
}

export interface IsoWeekContext {
  /** The ISO week year (may differ from calendar year near Jan 1) */
  isoWeekYear: number;
  /** ISO week number (1–53) */
  week: number;
  /** ISO day of week: 1=Mon … 7=Sun */
  dayOfWeek: number;
}

export interface DateComparableResult {
  inputDate: string;
  targetYear: number;
  comparableDate: string;
  method: ComparisonMethod;
  holiday?: HolidayContext;
  isoWeek?: IsoWeekContext;
}

export interface WeekComparableResult {
  inputWeek: { startDate: string; endDate: string; };
  targetYear: number;
  comparableWeek: { startDate: string; endDate: string; };
  method: ComparisonMethod;
  holiday?: HolidayContext;
  isoWeek?: IsoWeekContext;
}

export type DayEntry = DateComparableResult;

export interface RangeComparableResult {
  inputRange: { startDate: string; endDate: string; };
  targetYear: number;
  comparableRange: { startDate: string; endDate: string; };
  /** Per-day breakdown (only present when includeDays is true or range ≤ 14 days) */
  days?: DayEntry[];
}

export interface ApiError {
  error: string;
}
