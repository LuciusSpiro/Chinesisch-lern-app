import { useState, useEffect, useMemo } from 'react'
import type { Vokabel } from '../../types/vocabulary'

interface Card {
  id: string
  zeichen: string
  deutsch: string
  type: 'zeichen' | 'deutsch'
  pairKey: string
}

interface Props {
  words: Vokabel[]
  onFinish: (moves: number, seconds: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function MemorySpiel({ words, onFinish }: Props) {
  const cards = useMemo<Card[]>(() => {
    const pairs: Card[] = []
    words.forEach((w) => {
      pairs.push({ id: `z-${w.zeichen}`, zeichen: w.zeichen, deutsch: w.deutsch, type: 'zeichen', pairKey: w.zeichen })
      pairs.push({ id: `d-${w.zeichen}`, zeichen: w.zeichen, deutsch: w.deutsch, type: 'deutsch', pairKey: w.zeichen })
    })
    return shuffle(pairs)
  }, [words])

  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Card | null>(null)
  const [locked, setLocked] = useState(false)
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [wrong, setWrong] = useState<Set<string>>(new Set())

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (matched.size === cards.length) {
      onFinish(moves, seconds)
    }
  }, [matched.size, cards.length, moves, seconds, onFinish])

  function handleFlip(card: Card) {
    if (locked || revealed.has(card.id) || matched.has(card.id)) return

    const newRevealed = new Set(revealed).add(card.id)
    setRevealed(newRevealed)

    if (!selected) {
      setSelected(card)
      return
    }

    setMoves((m) => m + 1)

    if (selected.pairKey === card.pairKey && selected.id !== card.id) {
      const newMatched = new Set(matched).add(selected.id).add(card.id)
      setMatched(newMatched)
      setSelected(null)
    } else {
      setWrong(new Set([selected.id, card.id]))
      setLocked(true)
      setTimeout(() => {
        setRevealed((prev) => {
          const next = new Set(prev)
          next.delete(selected.id)
          next.delete(card.id)
          return next
        })
        setWrong(new Set())
        setSelected(null)
        setLocked(false)
      }, 900)
    }
  }

  const isRevealed = (id: string) => revealed.has(id) || matched.has(id)
  const isMatched = (id: string) => matched.has(id)
  const isWrong = (id: string) => wrong.has(id)

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Stats bar */}
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>⏱ {fmt(seconds)}</span>
        <span>{matched.size / 2} / {words.length} Paare</span>
        <span>{moves} Züge</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const rev = isRevealed(card.id)
          const mat = isMatched(card.id)
          const err = isWrong(card.id)

          let bg = 'bg-gray-100 dark:bg-gray-800'
          if (mat) bg = 'bg-green-100 dark:bg-green-900 border-green-400'
          else if (err) bg = 'bg-red-100 dark:bg-red-900 border-red-400'
          else if (rev) bg = 'bg-white dark:bg-gray-700 border-red-300'

          return (
            <button
              key={card.id}
              onClick={() => handleFlip(card)}
              className={`aspect-square rounded-xl border-2 flex items-center justify-center p-1 text-center transition-all active:scale-95 ${bg} ${
                mat ? 'border-green-400' : err ? 'border-red-400' : rev ? 'border-red-300' : 'border-transparent'
              }`}
            >
              {rev ? (
                card.type === 'zeichen' ? (
                  <span className="chinese-text text-2xl text-gray-800 dark:text-gray-100 leading-none">{card.zeichen}</span>
                ) : (
                  <span className="text-[11px] text-gray-700 dark:text-gray-200 leading-tight">{card.deutsch}</span>
                )
              ) : (
                <span className="text-2xl">🀄</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
