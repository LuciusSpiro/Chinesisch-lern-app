function normalize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[.,!?;:()\-–]/g, ' ')
    .split(/[\s/]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2)
}

/**
 * Returns true if the user's input contains at least one token (≥2 chars)
 * that matches a token in the expected German translation.
 * Matching is done in both directions to handle partial words.
 */
export function germanMatchesExpected(userInput: string, expected: string): boolean {
  const userTokens = normalize(userInput)
  const expectedTokens = normalize(expected)
  if (userTokens.length === 0) return false
  return userTokens.some((ut) =>
    expectedTokens.some(
      (et) =>
        et === ut ||
        (ut.length >= 3 && (et.includes(ut) || ut.includes(et)))
    )
  )
}
