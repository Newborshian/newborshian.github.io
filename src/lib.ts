const MONTHS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

/** "2025-06" → "juin 2025" */
export function formatMonth(value: string): string {
  const [year, month] = value.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}
