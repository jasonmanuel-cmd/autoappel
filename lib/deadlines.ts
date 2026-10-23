import type { RiskLevel } from './types'
// Urgency is based on the supplied deadline, never an invented three-day expiry.
export function computeRisk(deadline: string, now = Date.now()): RiskLevel {
  const time = Date.parse(deadline)
  if (!Number.isFinite(time)) return 'yellow'
  const days = (time-now)/86400000
  if (days <= 0) return 'expired'
  if (days <= 2) return 'red'
  if (days <= 7) return 'orange'
  if (days <= 14) return 'yellow'
  return 'green'
}
