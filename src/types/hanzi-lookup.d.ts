// Type declarations for the HanziLookupJS global script
// Source: https://github.com/gugray/HanziLookupJS

interface HanziLookupResult {
  character: string
  score: number
}

// Strokes: array of strokes, each stroke is array of [x, y] points (0–900 range)
type HanziLookupStroke = [number, number][]

declare global {
  const HanziLookup: {
    init(
      name: string,
      url: string,
      callback: () => void
    ): void
    AnalyzedCharacter: new (strokes: HanziLookupStroke[]) => object
    Matcher: new (name: string) => {
      match(
        analyzedChar: object,
        maxResults: number,
        callback: (matches: HanziLookupResult[]) => void
      ): void
    }
  }
}

export {}
