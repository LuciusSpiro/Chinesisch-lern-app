import { useMemo } from 'react'
import rawData from '../data/vokabeln-hsk-b1.json'
import type { Vokabel } from '../types/vocabulary'
import type { ProgressStore, TrainingMode } from '../lib/progress'
import { getSuccessRate, getNextReview } from '../lib/progress'

const allVokabeln = rawData as Vokabel[]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function useVocabulary() {
  return useMemo(() => {
    const singleChar = allVokabeln.filter((v) => v.zeichen.length === 1)

    function getWordsForSession(
      count: number,
      strategy: 'random' | 'weak-first' | 'due-first',
      store?: ProgressStore,
      mode?: TrainingMode,
      onlySingleChar = false
    ): Vokabel[] {
      const pool = onlySingleChar ? singleChar : allVokabeln
      if (strategy === 'random' || !store || !mode) {
        return shuffle(pool).slice(0, count)
      }
      if (strategy === 'due-first') {
        const now = Date.now()
        const shuffled = shuffle(pool)
        shuffled.sort((a, b) => {
          const aDue = getNextReview(store, a.zeichen, mode)
          const bDue = getNextReview(store, b.zeichen, mode)
          const aOverdue = aDue <= now
          const bOverdue = bDue <= now
          if (aOverdue && !bOverdue) return -1
          if (!aOverdue && bOverdue) return 1
          return aDue - bDue
        })
        return shuffled.slice(0, count)
      }
      // weak-first
      const sorted = shuffle(pool).sort(
        (a, b) => getSuccessRate(store, a.zeichen, mode) - getSuccessRate(store, b.zeichen, mode)
      )
      return sorted.slice(0, count)
    }

    return { allVokabeln, singleChar, getWordsForSession }
  }, [])
}
