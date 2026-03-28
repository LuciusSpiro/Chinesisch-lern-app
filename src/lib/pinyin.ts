// Maps all tone-marked vowels to their base vowel
const TONE_MAP: Record<string, string> = {
  'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
  'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
  'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
  'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
  'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
  'ǖ': 'u', 'ǘ': 'u', 'ǚ': 'u', 'ǜ': 'u',
}

export function stripTones(pinyin: string): string {
  return pinyin
    .split('')
    .map((c) => TONE_MAP[c] ?? c)
    .join('')
    .toLowerCase()
    .replace(/\s+/g, '')  // remove spaces between syllables
}

/** Compare user input (tone-insensitive) to expected pinyin */
export function pinyinEqual(userInput: string, expected: string): boolean {
  return stripTones(userInput.trim()) === stripTones(expected.trim())
}
