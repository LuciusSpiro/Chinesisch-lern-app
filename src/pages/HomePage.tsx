import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { isMastered } from '../lib/progress'
import { exportProgress, importProgress } from '../lib/export'
import { StatsPanel } from '../components/shared/StatsPanel'
import rawData from '../data/vokabeln-hsk-b1.json'
import type { Vokabel } from '../types/vocabulary'

const allWords = rawData as Vokabel[]
const singleCharWords = allWords.filter((v) => v.zeichen.length === 1)

const MODES = [
  {
    to: '/trainer',
    icon: '📚',
    title: 'Vokabel-Trainer',
    desc: 'Zeichen & Pinyin ↔ Deutsch',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    mode: 'trainer' as const,
    total: allWords.length,
  },
  {
    to: '/striche',
    icon: '✍️',
    title: 'Strich-Lernen',
    desc: 'Striche Schritt für Schritt lernen',
    color: 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    mode: 'trace' as const,
    total: allWords.length,
  },
  {
    to: '/abmalen',
    icon: '✏️',
    title: 'Abmal-Trainer',
    desc: 'Zeichen nach Vorlage nachzeichnen',
    color: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    iconBg: 'bg-green-100 dark:bg-green-900',
    mode: 'trace' as const,
    total: allWords.length,
  },
  {
    to: '/schreiben',
    icon: '🖊️',
    title: 'Schreib-Trainer',
    desc: 'Zeichen aus dem Gedächtnis malen',
    color: 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800',
    iconBg: 'bg-orange-100 dark:bg-orange-900',
    mode: 'write' as const,
    total: singleCharWords.length,
  },
]

export function HomePage() {
  const { store, reset, load } = useProgress()
  const importRef = useRef<HTMLInputElement>(null)
  const [showStats, setShowStats] = useState(false)

  function getMasteredCount(mode: typeof MODES[0]['mode'], total: number) {
    const pool = total === singleCharWords.length ? singleCharWords : allWords
    return pool.filter((v) => isMastered(store, v.zeichen, mode)).length
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    if (!confirm('Aktuellen Fortschritt überschreiben?')) return
    importProgress(
      file,
      (newStore) => load(newStore),
      (msg) => alert(msg)
    )
  }

  return (
    <div className="flex flex-col gap-6 p-4 pt-8">
      {/* Title */}
      <div className="text-center">
        <div className="chinese-text text-5xl font-thin text-red-600 mb-2">汉字</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">HSK B1 Lernapp</h1>
        <p className="text-sm text-gray-400 mt-1">{allWords.length} Vokabeln · HSK Stufe 3</p>
      </div>

      {/* Streak */}
      {store.currentStreak > 0 && (
        <div className="flex items-center justify-center gap-2 text-orange-500 font-semibold">
          <span className="text-2xl">🔥</span>
          <span>{store.currentStreak} {store.currentStreak === 1 ? 'Tag' : 'Tage'} in Folge</span>
        </div>
      )}

      {/* Mode cards */}
      <div className="flex flex-col gap-3">
        {MODES.map((m) => {
          const mastered = getMasteredCount(m.mode, m.total)
          return (
            <Link
              key={m.to}
              to={m.to}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${m.color} active:scale-[0.98] transition-transform`}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl ${m.iconBg}`}>
                {m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{m.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{m.desc}</p>
                <div className="mt-1.5 w-full bg-white dark:bg-gray-800 rounded-full h-1.5">
                  <div
                    className="bg-red-400 h-1.5 rounded-full"
                    style={{ width: `${(mastered / m.total) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{mastered} / {m.total} gemeistert</p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Stats */}
      <button
        onClick={() => setShowStats((s) => !s)}
        className="text-sm text-gray-500 dark:text-gray-400 text-center py-1 font-medium"
      >
        {showStats ? '▲ Statistik ausblenden' : '▼ Statistik anzeigen'}
      </button>
      {showStats && (
        <StatsPanel store={store} allWords={allWords} singleCharWords={singleCharWords} />
      )}

      {/* Export / Import */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => exportProgress(store)}
          className="text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 active:scale-95 transition-transform"
        >
          Exportieren
        </button>
        <button
          onClick={() => importRef.current?.click()}
          className="text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 active:scale-95 transition-transform"
        >
          Importieren
        </button>
        <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
      </div>

      {/* Reset button */}
      <button
        onClick={() => {
          if (confirm('Gesamten Fortschritt zurücksetzen?')) reset()
        }}
        className="text-sm text-gray-300 dark:text-gray-600 text-center py-2 active:text-gray-500"
      >
        Fortschritt zurücksetzen
      </button>
    </div>
  )
}
