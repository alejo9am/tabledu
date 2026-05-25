/**
 * Convert any search input into normalized word tokens.
 * - lowercase
 * - remove accents
 * - remove punctuation/symbols
 * - collapse spaces
 */
export const toSearchTokens = (value) => {
  const normalized = String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized) {
    return []
  }

  return normalized.split(' ').filter(Boolean)
}
