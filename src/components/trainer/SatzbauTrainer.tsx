import { useState, useMemo, useCallback } from 'react'
import type { Satz } from '../../types/saetze'
import { ProgressBar } from '../shared/ProgressBar'

interface Props {
  saetze: Satz[]
  onFinish: (correct: number, total: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type Phase = 'building' | 'correct' | 'wrong'

export function SatzbauTrainer({ saetze, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [phase, setPhase] = useState<Phase>('building')
  const [answer, setAnswer] = useState<string[]>([])

  const current = saetze[index]

  const chips = useMemo(() => shuffle([...current.woerter]), [current])
  const usedIndices = useMemo(() => {
    // track which chip positions have been used (by original shuffled position)
    const used = new Set<number>()
    let remaining = [...answer]
    chips.forEach((chip, i) => {
      const pos = remaining.indexOf(chip)
      if (pos !== -1) {
        used.add(i)
        remaining.splice(pos, 1)
      }
    })
    return used
  }, [answer, chips])

  const addWord = useCallback((word: string, chipIndex: number) => {
    if (phase !== 'building') return
    if (usedIndices.has(chipIndex)) return
    setAnswer((prev) => [...prev, word])
  }, [phase, usedIndices])

  const removeLastWord = useCallback(() => {
    if (phase !== 'building') return
    setAnswer((prev) => prev.slice(0, -1))
  }, [phase])

  function checkAnswer() {
    const correct = answer.join('') === current.woerter.join('')
    if (correct) {
      setCorrectCount((c) => c + 1)
      setPhase('correct')
    } else {
      setPhase('wrong')
    }
  }

  function goNext() {
    if (index + 1 >= saetze.length) {
      onFinish(phase === 'correct' ? correctCount : correctCount, saetze.length)
    } else {
      setIndex((i) => i + 1)
      setAnswer([])
      setPhase('building')
    }
  }

  if (!current) return null

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <ProgressBar current={index} total={saetze.length} />
        <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{index + 1} / {saetze.length}</p>
      </div>

      {/* German sentence as prompt */}
      <div className="bg-indigo-50 dark:bg-indigo-950 rounded-2xl p-4 text-center">
        <p className="text-sm text-indigo-400 dark:text-indigo-500 mb-1">Übersetze ins Chinesische:</p>
        <p className="text-base font-medium text-gray-800 dark:text-gray-100">{current.deutsch}</p>
      </div>

      {/* Answer area */}
      <div
        className={`min-h-[64px] rounded-2xl border-2 p-3 flex flex-wrap gap-2 items-center transition-colors ${
          phase === 'correct'
            ? 'bg-green-50 dark:bg-green-950 border-green-400'
            : phase === 'wrong'
            ? 'bg-red-50 dark:bg-red-950 border-red-400'
            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}
      >
        {answer.length === 0 ? (
          <span className="text-sm text-gray-300 dark:text-gray-600">Tippe unten auf Wörter…</span>
        ) : (
          answer.map((w, i) => (
            <span key={i} className="chinese-text text-lg bg-white dark:bg-gray-700 rounded-lg px-2 py-1 shadow-sm text-gray-800 dark:text-gray-100">
              {w}
            </span>
          ))
        )}
      </div>

      {/* Feedback */}
      {phase === 'correct' && (
        <p className="text-center text-green-600 dark:text-green-400 font-semibold">✓ Richtig!</p>
      )}
      {phase === 'wrong' && (
        <div className="text-center">
          <p className="text-red-500 font-semibold">✗ Nicht ganz richtig</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 chinese-text">
            Lösung: {current.woerter.join(' ')}
          </p>
        </div>
      )}

      {/* Word chips */}
      {phase === 'building' && (
        <div className="flex flex-wrap gap-2 justify-center">
          {chips.map((chip, i) => (
            <button
              key={i}
              onClick={() => addWord(chip, i)}
              disabled={usedIndices.has(i)}
              className={`chinese-text text-lg px-3 py-2 rounded-xl border-2 transition-all active:scale-95 ${
                usedIndices.has(i)
                  ? 'opacity-30 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400'
                  : 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950 text-gray-800 dark:text-gray-100'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {phase === 'building' ? (
          <>
            {answer.length > 0 && (
              <button
                onClick={removeLastWord}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm active:scale-95"
              >
                ← Zurück
              </button>
            )}
            <button
              onClick={checkAnswer}
              disabled={answer.length === 0}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold active:scale-95 disabled:opacity-40"
            >
              Prüfen
            </button>
          </>
        ) : (
          <button
            onClick={goNext}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold active:scale-95"
          >
            {index + 1 >= saetze.length ? 'Abschließen' : 'Weiter →'}
          </button>
        )}
      </div>
    </div>
  )
}
