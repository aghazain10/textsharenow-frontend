/**
 * POST /api/pro/logout
 * Response: { ok: true }
 * Clears the pro session cookie.
 */
import { clearProSession } from '../../utils/pro'

export default defineEventHandler(async (event) => {
  clearProSession(event)
  return { ok: true }
})
