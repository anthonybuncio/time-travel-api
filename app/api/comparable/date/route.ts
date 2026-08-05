/**
 * POST /api/comparable/date
 *
 * Maps a single calendar date to its holiday-aware comparable date in a
 * target year. Uses a holiday window when the date falls near a registered
 * holiday; otherwise falls back to same ISO week + day-of-week.
 *
 * Request body:
 *   date        string   YYYY-MM-DD — the date to map
 *   targetYear  number   Calendar year to map into (1900–2100)
 *   windowDays  number?  Override per-holiday window defaults (0–365)
 *
 * Response (200):  DateComparableResult
 * Response (400):  { error: string }
 */

import { getComparableDate } from '@/lib/comparable'

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

  const { date, targetYear, windowDays } = body as Record<string, unknown>

  if (typeof date !== 'string') {
    return Response.json({ error: '"date" is required and must be a string.' }, { status: 400 })
  }
  if (typeof targetYear !== 'number') {
    return Response.json({ error: '"targetYear" is required and must be a number.' }, { status: 400 })
  }

  const result = getComparableDate({
    date,
    targetYear,
    windowDays: windowDays as number | undefined,
  })

  if ('error' in result) {
    return Response.json(result, { status: 400 })
  }

  return Response.json(result)
}
