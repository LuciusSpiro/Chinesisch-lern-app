import { useState, useMemo } from 'react'
import { useLernen } from '../hooks/useLernen'
import type { Vokabel } from '../types/vocabulary'

type Tab = 'vokabeln' | 'zeichen'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function LernenDeck({
  pool,
  sterne,
  onStar,
}: {
  pool: Vokabel[]
  sterne: Vokabel[]
  onStar: (zeichen: string) => void
}) {
  const [roundKey, setRoundKey] = useState(0)
  const [index, setIndex] = useState(0)

  const order = useMemo(() => shuffle(pool.map((v) => v.zeichen)), [pool.length, roundKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const zeichen = order[index]
  const current = pool.find((v) => v.zeichen === zeichen)
  const isStarred = sterne.some((s) => s.zeichen === zeichen)

  if (pool.length === 0) {
    return <p className="text-center text-gray-400 mt-8">Keine Wörter im Pool</p>
  }

  if (!current) return null

  function goNext() {
    if (index + 1 >= order.length) {
      setRoundKey((k) => k + 1)
      setIndex(0)
    } else {
      setIndex((i) => i + 1)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 px-4 pt-4 pb-6">
      {/* Progress dots */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {order.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === index
                ? 'bg-red-500'
                : i < index
                ? 'bg-red-200 dark:bg-red-800'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-md p-8 flex flex-col items-center gap-4 min-h-[240px] justify-center">
        <span className="chinese-text text-6xl font-medium text-gray-900 dark:text-gray-100">
          {current.zeichen}
        </span>
        <span className="text-lg text-gray-400 dark:text-gray-500 tracking-widest">
          {current.pinyin}
        </span>
        <span className="text-xl text-gray-700 dark:text-gray-300 text-center">
          {current.deutsch}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => !isStarred && onStar(current.zeichen)}
          disabled={isStarred}
          className={`py-3 px-5 rounded-2xl border-2 text-xl transition-all active:scale-95 ${
            isStarred
              ? 'border-yellow-200 dark:border-yellow-800 opacity-40 cursor-default'
              : 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950'
          }`}
          title={isStarred ? 'Bereits gemerkt' : 'Zum Üben merken'}
        >
          ⭐
        </button>
        <button
          onClick={goNext}
          className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-semibold text-base active:scale-95"
        >
          {index + 1 >= order.length ? 'Neue Runde →' : 'Weiter →'}
        </button>
      </div>

      <p className="text-xs text-gray-400">
        {index + 1} / {order.length}
      </p>
    </div>
  )
}

export function LernenPage() {
  const [tab, setTab] = useState<Tab>('vokabeln')
  const { vokabelPool, vokabelSterne, zeichenPool, zeichenSterne, starVokabel, starZeichen } = useLernen()

  const pool = tab === 'vokabeln' ? vokabelPool : zeichenPool
  const sterne = tab === 'vokabeln' ? vokabelSterne : zeichenSterne
  const starFn = tab === 'vokabeln' ? starVokabel : starZeichen

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Lernen</h2>
        <p className="text-sm text-gray-400">Tippe ⭐ um ein Wort zum Üben zu merken</p>
      </div>

      {/* Tab toggle */}
      <div className="flex px-4 pb-3 gap-2">
        <button
          onClick={() => setTab('vokabeln')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'vokabeln'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Vokabeln
        </button>
        <button
          onClick={() => setTab('zeichen')}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            tab === 'zeichen'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Zeichen
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <LernenDeck pool={pool} sterne={sterne} onStar={starFn} />
      </div>
    </div>
  )
}
