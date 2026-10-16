/**
 * GET /api/pro/status
 * Response: { pro: boolean }
 *
 * Reads the signed session cookie, consulting the Redis cache and
 * re-verifying with Gumroad only when the cache has expired.
 */
import { isPro } from '../../utils/pro'

export default defineEventHandler(async (event) => {
  return { pro: await isPro(event) }
})
