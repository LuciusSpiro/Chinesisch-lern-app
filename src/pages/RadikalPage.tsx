import { useState } from 'react'
import { getRadikale } from '../lib/radikale'
import { RadikalTrainer } from '../components/trainer/RadikalTrainer'

const radikale = getRadikale()

export function RadikalPage() {
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null)
  const [key, setKey] = useState(0)

  if (radikale.length < 4) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-center text-gray-400">
        Nicht genug Radikal-Daten in den Vokabeln. Bitte Komponenten-Felder ergänzen.
      </div>
    )
  }

  if (result) {
    const pct = Math.round((result.correct / result.total) * 100)
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="text-6xl">{pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '💪'}</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {result.correct} / {result.total} richtig
        </h2>
        <p className="text-gray-500 dark:text-gray-400">{pct}% Trefferquote</p>
        <button
          onClick={() => { setResult(null); setKey((k) => k + 1) }}
          className="px-8 py-3 bg-teal-600 text-white rounded-full font-semibold text-lg active:scale-95"
        >
          Nochmal
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-1">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Radikal-Quiz</h2>
        <p className="text-sm text-gray-400">{radikale.length} Bausteine verfügbar</p>
      </div>
      <RadikalTrainer key={key} radikale={radikale} onFinish={(c, t) => setResult({ correct: c, total: t })} />
    </div>
  )
}
