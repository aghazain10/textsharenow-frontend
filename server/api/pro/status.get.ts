/**
 * GET /api/pro/status
 * Response: {
 *   pro: boolean,
 *   via: 'bearer' | 'cookie' | null,
 *   plan: 'monthly' | 'annual' | null,
 *   email: string | null,       // masked
 *   renewsAt: string | null,    // ISO — next expected charge
 *   endsAt: string | null       // ISO — access end for a cancelled plan
 * }
 *
 * Accepts either credential: the signed session cookie (browser) or an
 * `Authorization: Bearer <license-key>` header (API + MCP clients). Both go
 * through the same Gumroad cache, so the answer is always consistent.
 */
import { resolvePro, maskEmail } from '../../utils/pro'

export default defineEventHandler(async (event) => {
  const { pro, via, plan, email, renewsAt, endsAt } = await resolvePro(event)
  return {
    pro,
    via,
    plan: plan ?? null,
    email: maskEmail(email),
    renewsAt: renewsAt ?? null,
    endsAt: endsAt ?? null,
  }
})
