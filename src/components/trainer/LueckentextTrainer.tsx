import { useState, useMemo } from 'react'
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

export function LueckentextTrainer({ saetze, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const current = saetze[index]

  const options = useMemo(() => {
    if (!current) return []
    return shuffle([current.luecke.wort, ...current.luecke.alternativen])
  }, [current])

  // Build display tokens with the gap marked
  const displayTokens = useMemo(() => {
    if (!current) return []
    return current.woerter.map((w, i) =>
      i === current.luecke.position ? null : w
    )
  }, [current])

  function handleChoose(wort: string) {
    if (chosen !== null) return
    setChosen(wort)
    const correct = wort === current.luecke.wort
    if (correct) setCorrectCount((c) => c + 1)
    setTimeout(() => {
      if (index + 1 >= saetze.length) {
        onFinish(correct ? correctCount + 1 : correctCount, saetze.length)
      } else {
        setIndex((i) => i + 1)
        setChosen(null)
      }
    }, 900)
  }

  if (!current) return null

  return (
    <div className="flex flex-col gap-5 p-4 pt-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <ProgressBar current={index} total={saetze.length} />
        <p className="text-xs text-gray-400 dark:text-gray-500 text-right">{index + 1} / {saetze.length}</p>
      </div>

      {/* German translation hint */}
      <div className="bg-amber-50 dark:bg-amber-950 rounded-2xl p-4 text-center">
        <p className="text-sm text-amber-400 dark:text-amber-600 mb-1">Bedeutung:</p>
        <p className="text-base text-gray-700 dark:text-gray-300">{current.deutsch}</p>
      </div>

      {/* Sentence with gap */}
      <div className="flex flex-wrap justify-center items-center gap-1 min-h-[56px]">
        {displayTokens.map((token, i) =>
          token === null ? (
            <span
              key={i}
              className={`chinese-text text-xl font-medium px-3 py-1 rounded-lg border-2 min-w-[48px] text-center transition-colors ${
                chosen === null
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950 text-amber-500'
                  : chosen === current.luecke.wort
                  ? 'border-green-400 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                  : 'border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
              }`}
            >
              {chosen !== null ? (
                chosen === current.luecke.wort ? chosen : (
                  <>
                    <span className="line-through opacity-50">{chosen}</span>
                  </>
                )
              ) : '___'}
            </span>
          ) : (
            <span key={i} className="chinese-text text-xl text-gray-800 dark:text-gray-100">
              {token}
            </span>
          )
        )}
        <span className="text-gray-600 dark:text-gray-400 text-xl">。</span>
      </div>

      {/* Correct answer reveal if wrong */}
      {chosen !== null && chosen !== current.luecke.wort && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Richtige Antwort: <span className="chinese-text font-semibold text-green-600 dark:text-green-400">{current.luecke.wort}</span>
        </p>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          let style = 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100'
          if (chosen !== null) {
            if (opt === current.luecke.wort) {
              style = 'bg-green-100 dark:bg-green-900 border-green-400 text-green-800 dark:text-green-200'
            } else if (opt === chosen) {
              style = 'bg-red-100 dark:bg-red-900 border-red-400 text-red-800 dark:text-red-200'
            }
          }
          return (
            <button
              key={opt}
              onClick={() => handleChoose(opt)}
              className={`chinese-text text-lg py-4 rounded-2xl border-2 transition-colors active:scale-95 ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
