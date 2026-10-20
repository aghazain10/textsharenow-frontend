/**
 * GET /api/pro/status
 * Response: { pro: boolean, via: 'bearer' | 'cookie' | null }
 *
 * Accepts either credential: the signed session cookie (browser) or an
 * `Authorization: Bearer <license-key>` header (API + MCP clients). Both go
 * through the same Gumroad cache, so the answer is always consistent.
 */
import { resolvePro } from '../../utils/pro'

export default defineEventHandler(async (event) => {
  const { pro, via } = await resolvePro(event)
  return { pro, via }
})
