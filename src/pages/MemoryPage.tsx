import { useState } from 'react'
import { useVocabulary } from '../hooks/useVocabulary'
import { MemorySpiel } from '../components/trainer/MemorySpiel'

const PAIR_COUNT = 8

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function MemoryPage() {
  const { singleChar } = useVocabulary()
  const [words] = useState(() => shuffle(singleChar).slice(0, PAIR_COUNT))
  const [result, setResult] = useState<{ moves: number; seconds: number } | null>(null)
  const [key, setKey] = useState(0)

  if (result) {
    const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Alle Paare gefunden!</h2>
        <div className="flex gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-pink-500">{result.moves}</p>
            <p className="text-sm text-gray-400">Züge</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-pink-500">{fmt(result.seconds)}</p>
            <p className="text-sm text-gray-400">Zeit</p>
          </div>
        </div>
        <button
          onClick={() => { setResult(null); setKey((k) => k + 1) }}
          className="px-8 py-3 bg-pink-500 text-white rounded-full font-semibold text-lg active:scale-95"
        >
          Nochmal spielen
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-1">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Memory</h2>
        <p className="text-sm text-gray-400">Finde alle {PAIR_COUNT} Zeichenpaare</p>
      </div>
      <MemorySpiel
        key={key}
        words={words}
        onFinish={(moves, seconds) => setResult({ moves, seconds })}
      />
    </div>
  )
}
