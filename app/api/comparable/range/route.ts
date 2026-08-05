/**
 * POST /api/comparable/range
 *
 * Maps a date range to its comparable range in a target year, day by day.
 * Maximum range: 366 days. Per-day breakdown is included automatically for
 * ranges ≤ 14 days; set includeDays: true to force it for longer ranges.
 *
 * Request body:
 *   startDate   string   YYYY-MM-DD
 *   endDate     string   YYYY-MM-DD
 *   targetYear  number   Calendar year to map into (1900–2100)
 *   windowDays  number?  Override per-holiday window defaults (0–365)
 *   includeDays boolean? Force per-day breakdown in response (default: auto)
 *
 * Response (200):  RangeComparableResult
 * Response (400):  { error: string }
 */

import { getComparableRange } from '@/lib/comparable'

export async function POST(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return Response.json({ error: 'Request body must be a JSON object.' }, { status: 400 })
  }

  const { startDate, endDate, targetYear, windowDays, includeDays } =
    body as Record<string, unknown>

  if (typeof startDate !== 'string') {
    return Response.json({ error: '"startDate" is required and must be a string.' }, { status: 400 })
  }
  if (typeof endDate !== 'string') {
    return Response.json({ error: '"endDate" is required and must be a string.' }, { status: 400 })
  }
  if (typeof targetYear !== 'number') {
    return Response.json({ error: '"targetYear" is required and must be a number.' }, { status: 400 })
  }

  const result = getComparableRange({
    startDate,
    endDate,
    targetYear,
    windowDays: windowDays as number | undefined,
    includeDays: includeDays as boolean | undefined,
  })

  if ('error' in result) {
    return Response.json(result, { status: 400 })
  }

  return Response.json(result)
}
