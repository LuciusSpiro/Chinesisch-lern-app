import rawData from '../data/vokabeln-hsk-b1.json'
import type { Vokabel } from '../types/vocabulary'

export interface Radikal {
  zeichen: string
  pinyin: string
  deutsch: string
  vorkommenIn: string[]  // zeichen der Vokabeln, die diesen Radikal enthalten
}

let _cache: Radikal[] | null = null

export function getRadikale(): Radikal[] {
  if (_cache) return _cache

  const map = new Map<string, Radikal>()
  const vokabeln = rawData as Vokabel[]

  for (const v of vokabeln) {
    if (!v.komponenten) continue
    for (const [ch, k] of Object.entries(v.komponenten)) {
      const existing = map.get(ch)
      if (existing) {
        existing.vorkommenIn.push(v.zeichen)
      } else {
        map.set(ch, { zeichen: ch, pinyin: k.pinyin, deutsch: k.deutsch, vorkommenIn: [v.zeichen] })
      }
    }
  }

  // Nur Radikale behalten, die in mindestens 2 Vokabeln vorkommen → mehr Kontext
  _cache = Array.from(map.values()).filter((r) => r.vorkommenIn.length >= 2)
  return _cache
}
