import { useState, useMemo } from 'react'
import type { Radikal } from '../../lib/radikale'

interface Props {
  radikale: Radikal[]
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

export function RadikalTrainer({ radikale, onFinish }: Props) {
  const session = useMemo(() => shuffle(radikale).slice(0, 15), [radikale])
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  const current = session[index]

  const options = useMemo(() => {
    if (!current) return []
    const wrong = shuffle(radikale.filter((r) => r.zeichen !== current.zeichen)).slice(0, 3)
    return shuffle([current, ...wrong])
  }, [current, radikale])

  function handleChoose(deutsch: string) {
    if (chosen !== null) return
    setChosen(deutsch)
    const correct = deutsch === current.deutsch
    if (correct) setCorrectCount((c) => c + 1)
    setTimeout(() => {
      if (index + 1 >= session.length) {
        onFinish(correct ? correctCount + 1 : correctCount, session.length)
      } else {
        setIndex((i) => i + 1)
        setChosen(null)
      }
    }, 800)
  }

  if (!current) return null

  return (
    <div className="flex flex-col items-center gap-6 p-6 pt-8">
      {/* Progress */}
      <div className="w-full">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all"
            style={{ width: `${(index / session.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">{index + 1} / {session.length}</p>
      </div>

      {/* Radikal anzeigen */}
      <div className="flex flex-col items-center gap-2">
        <div className="chinese-text text-7xl font-thin text-teal-600 dark:text-teal-400 leading-none">
          {current.zeichen}
        </div>
        <p className="text-gray-400 dark:text-gray-500 tracking-widest">{current.pinyin}</p>
        <p className="text-xs text-gray-300 dark:text-gray-600 text-center mt-1">
          Kommt vor in: {current.vorkommenIn.slice(0, 4).join(' · ')}
        </p>
      </div>

      {/* Frage */}
      <p className="text-base text-gray-600 dark:text-gray-300 font-medium">Was bedeutet dieser Baustein?</p>

      {/* Antwortoptionen */}
      <div className="w-full grid grid-cols-2 gap-3">
        {options.map((opt) => {
          let bg = 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100'
          if (chosen !== null) {
            if (opt.deutsch === current.deutsch) {
              bg = 'bg-green-100 dark:bg-green-900 border-green-400 text-green-800 dark:text-green-200'
            } else if (opt.deutsch === chosen) {
              bg = 'bg-red-100 dark:bg-red-900 border-red-400 text-red-800 dark:text-red-200'
            }
          }
          return (
            <button
              key={opt.zeichen}
              onClick={() => handleChoose(opt.deutsch)}
              className={`py-4 px-3 rounded-2xl border-2 text-sm font-medium transition-colors active:scale-95 ${bg}`}
            >
              {opt.deutsch}
            </button>
          )
        })}
      </div>
    </div>
  )
}
