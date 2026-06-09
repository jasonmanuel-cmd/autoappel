export interface PromoCode {
  code: string
  label: string
  discountPercent: number
  maxUses: number
}

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'LAUNCH5',
    label: 'Founding Launch — Free Strategy',
    discountPercent: 100,
    maxUses: 5,
  },
]

export function getPromo(code: string): PromoCode | undefined {
  return PROMO_CODES.find(p => p.code.toUpperCase() === code.toUpperCase().trim())
}

export function getDiscountedAmount(amount: number, promo: PromoCode): number {
  return Math.round((amount * (100 - promo.discountPercent)) / 100 * 100) / 100
}

export function isFree(promo: PromoCode): boolean {
  return promo.discountPercent >= 100
}
