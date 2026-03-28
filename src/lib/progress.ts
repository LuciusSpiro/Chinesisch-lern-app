const STORAGE_KEY = 'hsk-b1-progress'
const SCHEMA_VERSION = 1

export type TrainingMode = 'trainer' | 'write' | 'trace'

export interface WordProgress {
  trainerAttempts: number
  trainerCorrect: number
  trainerLastSeen: number
  trainerInterval: number
  trainerEaseFactor: number
  trainerNextReview: number

  writeAttempts: number
  writeCorrect: number
  writeLastSeen: number
  writeInterval: number
  writeEaseFactor: number
  writeNextReview: number

  traceAttempts: number
  traceCompletions: number
  traceLastSeen: number
  traceInterval: number
  traceEaseFactor: number
  traceNextReview: number
}

export interface ProgressStore {
  version: typeof SCHEMA_VERSION
  words: Record<string, WordProgress>
  lastStudyDate: string
  currentStreak: number
  longestStreak: number
}

function defaultWord(): WordProgress {
  return {
    trainerAttempts: 0, trainerCorrect: 0, trainerLastSeen: 0,
    trainerInterval: 1, trainerEaseFactor: 2.5, trainerNextReview: 0,
    writeAttempts: 0, writeCorrect: 0, writeLastSeen: 0,
    writeInterval: 1, writeEaseFactor: 2.5, writeNextReview: 0,
    traceAttempts: 0, traceCompletions: 0, traceLastSeen: 0,
    traceInterval: 1, traceEaseFactor: 2.5, traceNextReview: 0,
  }
}

function applySm2(word: WordProgress, prefix: 'trainer' | 'write' | 'trace', correct: boolean): WordProgress {
  const intervalKey = `${prefix}Interval` as keyof WordProgress
  const efKey = `${prefix}EaseFactor` as keyof WordProgress
  const nextKey = `${prefix}NextReview` as keyof WordProgress

  const ef = word[efKey] as number
  const interval = word[intervalKey] as number
  const q = correct ? 5 : 1

  const newEf = Math.max(1.3, ef + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newInterval: number
  if (!correct) {
    newInterval = 1
  } else if (interval <= 1) {
    newInterval = 6
  } else {
    newInterval = Math.round(interval * newEf)
  }

  const nextReview = Date.now() + newInterval * 86_400_000

  return {
    ...word,
    [intervalKey]: newInterval,
    [efKey]: newEf,
    [nextKey]: nextReview,
  }
}

function migrateWord(raw: Partial<WordProgress>): WordProgress {
  return { ...defaultWord(), ...raw }
}

export function loadProgress(): ProgressStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { version: SCHEMA_VERSION, words: {}, lastStudyDate: '', currentStreak: 0, longestStreak: 0 }
    const parsed = JSON.parse(raw) as Partial<ProgressStore>
    if (parsed.version !== SCHEMA_VERSION) return { version: SCHEMA_VERSION, words: {}, lastStudyDate: '', currentStreak: 0, longestStreak: 0 }

    const migratedWords: Record<string, WordProgress> = {}
    for (const [key, val] of Object.entries(parsed.words ?? {})) {
      migratedWords[key] = migrateWord(val as Partial<WordProgress>)
    }

    return {
      version: SCHEMA_VERSION,
      words: migratedWords,
      lastStudyDate: parsed.lastStudyDate ?? '',
      currentStreak: parsed.currentStreak ?? 0,
      longestStreak: parsed.longestStreak ?? 0,
    }
  } catch {
    return { version: SCHEMA_VERSION, words: {}, lastStudyDate: '', currentStreak: 0, longestStreak: 0 }
  }
}

export function saveProgress(store: ProgressStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function updateStreak(store: ProgressStore): ProgressStore {
  const today = new Date().toISOString().slice(0, 10)
  if (store.lastStudyDate === today) return store

  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
  const newStreak = store.lastStudyDate === yesterday ? store.currentStreak + 1 : 1
  const longestStreak = Math.max(store.longestStreak, newStreak)

  return { ...store, lastStudyDate: today, currentStreak: newStreak, longestStreak }
}

export function recordAttempt(
  store: ProgressStore,
  zeichen: string,
  mode: TrainingMode,
  correct: boolean
): ProgressStore {
  const word = store.words[zeichen] ?? defaultWord()
  const now = Date.now()
  let updated = { ...word }

  if (mode === 'trainer') {
    updated.trainerAttempts++
    if (correct) updated.trainerCorrect++
    updated.trainerLastSeen = now
    updated = applySm2(updated, 'trainer', correct)
  } else if (mode === 'write') {
    updated.writeAttempts++
    if (correct) updated.writeCorrect++
    updated.writeLastSeen = now
    updated = applySm2(updated, 'write', correct)
  } else {
    updated.traceAttempts++
    if (correct) updated.traceCompletions++
    updated.traceLastSeen = now
    updated = applySm2(updated, 'trace', correct)
  }

  return { ...store, words: { ...store.words, [zeichen]: updated } }
}

export function getSuccessRate(store: ProgressStore, zeichen: string, mode: TrainingMode): number {
  const w = store.words[zeichen]
  if (!w) return 0
  if (mode === 'trainer') return w.trainerAttempts > 0 ? w.trainerCorrect / w.trainerAttempts : 0
  if (mode === 'write') return w.writeAttempts > 0 ? w.writeCorrect / w.writeAttempts : 0
  return w.traceAttempts > 0 ? w.traceCompletions / w.traceAttempts : 0
}

export function getNextReview(store: ProgressStore, zeichen: string, mode: TrainingMode): number {
  const w = store.words[zeichen]
  if (!w) return 0
  if (mode === 'trainer') return w.trainerNextReview
  if (mode === 'write') return w.writeNextReview
  return w.traceNextReview
}

export function isMastered(store: ProgressStore, zeichen: string, mode: TrainingMode): boolean {
  const w = store.words[zeichen]
  if (!w) return false
  const attempts = mode === 'trainer' ? w.trainerAttempts : mode === 'write' ? w.writeAttempts : w.traceAttempts
  return attempts >= 5 && getSuccessRate(store, zeichen, mode) >= 0.8
}
