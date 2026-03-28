import rawData from '../data/vokabeln-hsk-b1.json'
import type { Vokabel } from '../types/vocabulary'

const allVokabeln = rawData as Vokabel[]
const allSingleChar = allVokabeln.filter((v) => v.zeichen.length === 1)

const STORAGE_KEY = 'hsk-b1-lernen'
const POOL_SIZE = 15

export interface LernenStore {
  version: 1
  vokabelPool: string[]
  vokabelSterne: string[]
  zeichenPool: string[]
  zeichenSterne: string[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickReplacement(
  allChars: Vokabel[],
  exclude: string[]
): string | null {
  const excludeSet = new Set(exclude)
  const candidates = allChars.filter((v) => !excludeSet.has(v.zeichen))
  if (candidates.length === 0) return null
  return shuffle(candidates)[0].zeichen
}

function defaultStore(): LernenStore {
  const vPool = shuffle(allVokabeln).slice(0, POOL_SIZE).map((v) => v.zeichen)
  const zPool = shuffle(allSingleChar).slice(0, POOL_SIZE).map((v) => v.zeichen)
  return { version: 1, vokabelPool: vPool, vokabelSterne: [], zeichenPool: zPool, zeichenSterne: [] }
}

export function loadLernen(): LernenStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStore()
    const parsed = JSON.parse(raw) as LernenStore
    if (parsed.version !== 1) return defaultStore()
    return parsed
  } catch {
    return defaultStore()
  }
}

export function saveLernen(store: LernenStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function starVokabel(store: LernenStore, zeichen: string): LernenStore {
  if (!store.vokabelPool.includes(zeichen)) return store
  const newPool = store.vokabelPool.filter((z) => z !== zeichen)
  const newSterne = [...store.vokabelSterne, zeichen]
  const replacement = pickReplacement(allVokabeln, [...newPool, ...newSterne])
  if (replacement) newPool.push(replacement)
  return { ...store, vokabelPool: newPool, vokabelSterne: newSterne }
}

export function unstarVokabel(store: LernenStore, zeichen: string): LernenStore {
  if (!store.vokabelSterne.includes(zeichen)) return store
  const newSterne = store.vokabelSterne.filter((z) => z !== zeichen)
  const newPool = [...store.vokabelPool, zeichen]
  return { ...store, vokabelPool: newPool, vokabelSterne: newSterne }
}

export function starZeichen(store: LernenStore, zeichen: string): LernenStore {
  if (!store.zeichenPool.includes(zeichen)) return store
  const newPool = store.zeichenPool.filter((z) => z !== zeichen)
  const newSterne = [...store.zeichenSterne, zeichen]
  const replacement = pickReplacement(allSingleChar, [...newPool, ...newSterne])
  if (replacement) newPool.push(replacement)
  return { ...store, zeichenPool: newPool, zeichenSterne: newSterne }
}

export function unstarZeichen(store: LernenStore, zeichen: string): LernenStore {
  if (!store.zeichenSterne.includes(zeichen)) return store
  const newSterne = store.zeichenSterne.filter((z) => z !== zeichen)
  const newPool = [...store.zeichenPool, zeichen]
  return { ...store, zeichenPool: newPool, zeichenSterne: newSterne }
}

export function getVokabelByZeichen(zeichen: string): Vokabel | undefined {
  return allVokabeln.find((v) => v.zeichen === zeichen)
}
