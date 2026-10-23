export const TRANSFER_OWNER_PREFIX = 'transfer:owner:'
export const TRANSFER_SUMMARY_PREFIX = 'transfer:summary:'
export const TRANSFER_PENDING_PREFIX = 'transfer:pending:'

export type TransferSummary = {
  owner: string
  count: number
  bytes: number
  ttl: number
  expiresAt: string
  createdAt: string
}

export function transferOwnerKey(licenseHash: string): string {
  return TRANSFER_OWNER_PREFIX + licenseHash
}

export function transferSummaryKey(code: string): string {
  return TRANSFER_SUMMARY_PREFIX + code
}
