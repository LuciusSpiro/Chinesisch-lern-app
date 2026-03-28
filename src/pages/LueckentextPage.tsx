import { useState, useMemo } from 'react'
import rawSaetze from '../data/saetze-hsk-b1.json'
import type { Satz } from '../types/saetze'
import { LueckentextTrainer } from '../components/trainer/LueckentextTrainer'

const allSaetze = rawSaetze as Satz[]
const SESSION_SIZE = 10

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function LueckentextPage() {
  const [key, setKey] = useState(0)
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null)
  const saetze = useMemo(() => shuffle(allSaetze).slice(0, SESSION_SIZE), [key]) // eslint-disable-line react-hooks/exhaustive-deps

  if (result) {
    const pct = Math.round((result.correct / result.total) * 100)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="text-6xl">{pct >= 80 ? '✅' : pct >= 60 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {result.correct} / {result.total} richtig
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{pct}% Trefferquote</p>
        <button
          onClick={() => { setResult(null); setKey((k) => k + 1) }}
          className="px-8 py-3 bg-amber-500 text-white rounded-full font-semibold text-lg active:scale-95"
        >
          Neue Session
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-1">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Lückentext</h2>
        <p className="text-sm text-gray-400">Finde das fehlende Wort im Satz</p>
      </div>
      <LueckentextTrainer key={key} saetze={saetze} onFinish={(c, t) => setResult({ correct: c, total: t })} />
    </div>
  )
}
