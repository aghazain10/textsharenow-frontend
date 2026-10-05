/**
 * GET /api/stats
 * Response: { count: number, fileCount: number }
 *
 * Returns the aggregate, anonymous total number of texts and files
 * shared through the tool (all-time). No content is ever exposed —
 * just two counters stored in Upstash Redis.
 */

const COUNT_KEY     = 'stats:shares'
const FILE_COUNT_KEY = 'stats:file_shares'

async function upstashRequest(url: string, token: string, command: unknown[]) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })

  if (!response.ok) {
    throw new Error(`Upstash error: ${response.status}`)
  }

  return response.json()
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { UPSTASH_REDIS_REST_URL: redisUrl, UPSTASH_REDIS_REST_TOKEN: redisToken } = config

  const [res, fileRes] = await Promise.all([
    upstashRequest(redisUrl, redisToken, ['GET', COUNT_KEY]),
    upstashRequest(redisUrl, redisToken, ['GET', FILE_COUNT_KEY]),
  ])

  const count     = Number.parseInt(res.result ?? '0', 10) || 0
  const fileCount = Number.parseInt(fileRes.result ?? '0', 10) || 0

  return { count, fileCount }
})
