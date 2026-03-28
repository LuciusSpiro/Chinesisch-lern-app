import type { ProgressStore, TrainingMode } from '../../lib/progress'
import { getSuccessRate, isMastered } from '../../lib/progress'
import type { Vokabel } from '../../types/vocabulary'

interface Props {
  store: ProgressStore
  allWords: Vokabel[]
  singleCharWords: Vokabel[]
}

interface ModeInfo {
  label: string
  mode: TrainingMode
  pool: Vokabel[]
}

export function StatsPanel({ store, allWords, singleCharWords }: Props) {
  const modes: ModeInfo[] = [
    { label: 'Vokabel-Trainer', mode: 'trainer', pool: allWords },
    { label: 'Abmalen / Striche', mode: 'trace', pool: allWords },
    { label: 'Schreiben', mode: 'write', pool: singleCharWords },
  ]

  const weakestWords = Object.entries(store.words)
    .filter(([, w]) => w.trainerAttempts >= 2)
    .map(([zeichen]) => ({
      zeichen,
      rate: getSuccessRate(store, zeichen, 'trainer'),
      vokabel: allWords.find((v) => v.zeichen === zeichen),
    }))
    .filter((e) => e.vokabel)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-4 px-4 pb-4">
      {/* Per-mode progress bars */}
      <div className="flex flex-col gap-3">
        {modes.map(({ label, mode, pool }) => {
          const mastered = pool.filter((v) => isMastered(store, v.zeichen, mode)).length
          const pct = Math.round((mastered / pool.length) * 100)
          return (
            <div key={mode}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">{label}</span>
                <span className="text-gray-400 dark:text-gray-500">{mastered} / {pool.length} ({pct}%)</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className="bg-red-400 h-2 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Weakest words */}
      {weakestWords.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Schwächste Vokabeln</p>
          <div className="flex flex-col gap-1">
            {weakestWords.map(({ zeichen, rate, vokabel }) => (
              <div key={zeichen} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                <span className="chinese-text text-xl text-gray-800 dark:text-gray-100 w-10">{zeichen}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500 flex-1 px-2 truncate">{vokabel?.deutsch}</span>
                <span className={`text-xs font-medium ${rate < 0.4 ? 'text-red-500' : rate < 0.7 ? 'text-orange-400' : 'text-yellow-500'}`}>
                  {Math.round(rate * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Longest streak */}
      {store.longestStreak > 1 && (
        <p className="text-xs text-gray-300 dark:text-gray-600 text-center">
          Längster Streak: {store.longestStreak} Tage
        </p>
      )}
    </div>
  )
}
