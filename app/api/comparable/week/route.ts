/**
 * POST /api/comparable/week
 *
 * Maps a Sun–Sat business week to its comparable week in a target year.
 * Provide any date within the desired week; the engine snaps to the Sunday
 * that opens the week. The comparable week is derived by mapping that Sunday
 * (holiday-window or ISO-week fallback) and extending +6 days.
 *
 * Request body:
 *   weekOf      string   YYYY-MM-DD — any date within the week of interest
 *   targetYear  number   Calendar year to map into (1900–2100)
 *   windowDays  number?  Override per-holiday window defaults (0–365)
 *
 * Response (200):  WeekComparableResult
 * Response (400):  { error: string }
 */

import { getComparableWeek } from '@/lib/comparable'

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

  const { weekOf, targetYear, windowDays } = body as Record<string, unknown>

  if (typeof weekOf !== 'string') {
    return Response.json({ error: '"weekOf" is required and must be a string.' }, { status: 400 })
  }
  if (typeof targetYear !== 'number') {
    return Response.json({ error: '"targetYear" is required and must be a number.' }, { status: 400 })
  }

  const result = getComparableWeek({
    weekOf,
    targetYear,
    windowDays: windowDays as number | undefined,
  })

  if ('error' in result) {
    return Response.json(result, { status: 400 })
  }

  return Response.json(result)
}
