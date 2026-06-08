interface ValidationResult {
  valid: boolean
  confidence: 'high' | 'medium' | 'low' | 'unknown'
  message: string
  suggestion?: string
}

const COUNTY_PATTERNS: Record<string, { prefix: string; hint: string }[]> = {
  Harris: [
    { prefix: 'TX-HC', hint: 'TX-HC-YYYY-NNNNN (e.g. TX-HC-2026-00421)' },
    { prefix: 'HC', hint: 'HC-YYYY-NNNNN' },
  ],
  'Fort Bend': [
    { prefix: 'TX-FB', hint: 'TX-FB-YYYY-NNNNN' },
    { prefix: 'FB', hint: 'FB-YYYY-NNNNN' },
  ],
  Montgomery: [
    { prefix: 'TX-MC', hint: 'TX-MC-YYYY-NNNNN' },
    { prefix: 'MC', hint: 'MC-YYYY-NNNNN' },
  ],
  Galveston: [
    { prefix: 'TX-GV', hint: 'TX-GV-YYYY-NNNNN' },
    { prefix: 'GV', hint: 'GV-YYYY-NNNNN' },
  ],
  Brazoria: [
    { prefix: 'TX-BZ', hint: 'TX-BZ-YYYY-NNNNN' },
    { prefix: 'BZ', hint: 'BZ-YYYY-NNNNN' },
  ],
  Chambers: [
    { prefix: 'TX-CC', hint: 'TX-CC-YYYY-NNNNN' },
    { prefix: 'CC', hint: 'CC-YYYY-NNNNN' },
  ],
}

function cleanCitation(num: string): string {
  return num.trim().toUpperCase()
}

function hasMinimumLength(num: string): boolean {
  return num.replace(/[^A-Z0-9]/g, '').length >= 5
}

function looksLikeTxStandard(num: string): boolean {
  return /^TX-[A-Z]{2}-\d{4}-\d{3,}$/i.test(num)
}

function looksLikeJpCase(num: string): boolean {
  return /^[A-Z]{2}\d{10}$/i.test(num) || /^\d{12}$/.test(num)
}

function looksLikeDallas(num: string): boolean {
  return /^C\d{7,8}$/i.test(num)
}

function getCountyPrefixes(county: string): string[] {
  const patterns = COUNTY_PATTERNS[county]
  if (!patterns) return []
  return patterns.map(p => p.prefix)
}

export function getCountyHint(county: string): string | undefined {
  const patterns = COUNTY_PATTERNS[county]
  if (!patterns) return undefined
  return patterns.map(p => p.hint).join(' or ')
}

export function validateCitationFormat(num: string, county?: string): ValidationResult {
  const cleaned = cleanCitation(num)

  if (!cleaned) {
    return { valid: false, confidence: 'unknown', message: 'Citation number is required' }
  }

  if (!hasMinimumLength(cleaned)) {
    return {
      valid: false,
      confidence: 'low',
      message: 'Citation number is too short — check that you entered the full number',
      suggestion: 'Texas citation numbers are typically at least 5 characters',
    }
  }

  if (looksLikeDallas(cleaned)) {
    return { valid: true, confidence: 'medium', message: 'Dallas municipal citation format recognized' }
  }

  if (looksLikeTxStandard(cleaned)) {
    const prefix = cleaned.split('-').slice(0, 2).join('-')
    if (county) {
      const allowedPrefixes = getCountyPrefixes(county)
      if (allowedPrefixes.length > 0 && !allowedPrefixes.some(p => prefix === p)) {
        const hint = getCountyHint(county)
        return {
          valid: false,
          confidence: 'medium',
          message: `Citation format doesn't match expected pattern for ${county} County`,
          suggestion: hint ? `${county} County citations typically look like: ${hint}` : undefined,
        }
      }
    }
    return { valid: true, confidence: 'high', message: 'Texas citation format recognized' }
  }

  if (looksLikeJpCase(cleaned)) {
    return { valid: true, confidence: 'medium', message: 'Justice Court case number format recognized' }
  }

  if (/^\d{6,10}$/.test(cleaned)) {
    return {
      valid: true,
      confidence: 'low',
      message: 'Numeric citation format — please verify this is your full citation number',
    }
  }

  if (cleaned.length >= 5) {
    return {
      valid: true,
      confidence: 'low',
      message: 'Citation format is uncommon — we will review it manually',
    }
  }

  return {
    valid: false,
    confidence: 'unknown',
    message: 'Citation number format not recognized',
    suggestion: county ? getCountyHint(county) : 'Check your ticket for a citation or case number',
  }
}

export function getCitationSuggestion(num: string, county?: string): string | undefined {
  const cleaned = cleanCitation(num)
  const result = validateCitationFormat(cleaned, county)

  if (result.valid) return undefined
  return result.suggestion || result.message
}
