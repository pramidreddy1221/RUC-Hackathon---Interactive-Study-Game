/**
 * Normalizes SQL string for comparison
 * - Converts to lowercase
 * - Collapses multiple spaces to single space
 * - Trims whitespace
 */
export function normalizeSql(str: string): string {
  return str.toLowerCase().replace(/\s+/g, ' ').trim()
}

