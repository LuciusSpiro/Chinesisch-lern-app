import { useReducer, useEffect } from 'react'
import {
  loadProgress,
  saveProgress,
  recordAttempt,
  updateStreak,
  type ProgressStore,
  type TrainingMode,
} from '../lib/progress'

type Action =
  | { type: 'RECORD'; zeichen: string; mode: TrainingMode; correct: boolean }
  | { type: 'RESET' }
  | { type: 'LOAD'; store: ProgressStore }

function reducer(state: ProgressStore, action: Action): ProgressStore {
  switch (action.type) {
    case 'RECORD':
      return recordAttempt(state, action.zeichen, action.mode, action.correct)
    case 'RESET':
      return { version: 1, words: {}, lastStudyDate: '', currentStreak: 0, longestStreak: 0 }
    case 'LOAD':
      return action.store
    default:
      return state
  }
}

export function useProgress() {
  const [store, dispatch] = useReducer(reducer, undefined, () => updateStreak(loadProgress()))

  useEffect(() => {
    saveProgress(store)
  }, [store])

  function record(zeichen: string, mode: TrainingMode, correct: boolean) {
    dispatch({ type: 'RECORD', zeichen, mode, correct })
  }

  function reset() {
    dispatch({ type: 'RESET' })
  }

  function load(newStore: ProgressStore) {
    dispatch({ type: 'LOAD', store: newStore })
  }

  return { store, record, reset, load }
}
