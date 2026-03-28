import { useState, useMemo } from 'react'
import type { Vokabel } from '../../types/vocabulary'

interface Props {
  word: Vokabel
  allWords: Vokabel[]
  onResult: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function GermanToChineseMode({ word, allWords, onResult }: Props) {
  const [chosen, setChosen] = useState<string | null>(null)

  const options = useMemo(() => {
    const wrong = shuffle(allWords.filter((v) => v.zeichen !== word.zeichen)).slice(0, 3)
    return shuffle([word, ...wrong])
  }, [word, allWords])

  function handleChoose(zeichen: string) {
    if (chosen !== null) return
    setChosen(zeichen)
    const correct = zeichen === word.zeichen
    setTimeout(() => {
      setChosen(null)
      onResult(correct)
    }, 900)
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6 pt-10">
      {/* German word */}
      <div className="text-center">
        <p className="text-3xl font-semibold text-gray-800 dark:text-gray-100">{word.deutsch}</p>
      </div>

      {/* Pinyin hint */}
      <details className="text-sm text-gray-400 text-center">
        <summary className="cursor-pointer">Pinyin-Hinweis anzeigen</summary>
        <p className="mt-1 tracking-widest">{word.pinyin}</p>
      </details>

      {/* Choice buttons */}
      <div className="w-full grid grid-cols-2 gap-3">
        {options.map((opt) => {
          let bg = 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100'
          if (chosen !== null) {
            if (opt.zeichen === word.zeichen) {
              bg = 'bg-green-100 dark:bg-green-900 border-green-400 text-green-800 dark:text-green-200'
            } else if (opt.zeichen === chosen) {
              bg = 'bg-red-100 dark:bg-red-900 border-red-400 text-red-800 dark:text-red-200'
            }
          }
          return (
            <button
              key={opt.zeichen}
              onClick={() => handleChoose(opt.zeichen)}
              className={`chinese-text text-4xl font-thin py-6 rounded-2xl border-2 transition-colors ${bg} active:scale-95`}
            >
              {opt.zeichen}
            </button>
          )
        })}
      </div>
    </div>
  )
}
