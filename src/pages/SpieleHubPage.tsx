import { Link } from 'react-router-dom'
import { useLernen } from '../hooks/useLernen'

const SPIELE = [
  {
    to: '/spiele/memory',
    icon: '🃏',
    title: 'Memory',
    desc: 'Zeichen und Bedeutungen als Kartenpaare finden',
    color: 'bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800',
    iconBg: 'bg-pink-100 dark:bg-pink-900',
  },
  {
    to: '/spiele/radikale',
    icon: '🔍',
    title: 'Radikal-Quiz',
    desc: 'Zeichenbausteine und ihre Bedeutungen lernen',
    color: 'bg-teal-50 border-teal-200 dark:bg-teal-950 dark:border-teal-800',
    iconBg: 'bg-teal-100 dark:bg-teal-900',
  },
  {
    to: '/spiele/satzbau',
    icon: '🧩',
    title: 'Satzbau-Puzzle',
    desc: 'Wörter in die richtige Reihenfolge bringen',
    color: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900',
  },
  {
    to: '/spiele/lueckentext',
    icon: '✏️',
    title: 'Lückentext',
    desc: 'Das fehlende Wort im Satz finden',
    color: 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
  },
]

function SternSection({
  title,
  icon,
  to,
  items,
  onUnstar,
  emptyHint,
}: {
  title: string
  icon: string
  to: string
  items: { zeichen: string; pinyin: string; deutsch: string }[]
  onUnstar: (zeichen: string) => void
  emptyHint: string
}) {
  return (
    <div className="rounded-2xl border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-semibold text-gray-800 dark:text-gray-100">{title}</span>
          {items.length > 0 && (
            <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full px-2 py-0.5">
              {items.length}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <Link
            to={to}
            className="text-sm font-semibold text-red-600 dark:text-red-400 px-3 py-1 rounded-lg bg-red-50 dark:bg-red-950 active:scale-95"
          >
            Üben →
          </Link>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 px-4 py-3">{emptyHint}</p>
      ) : (
        <div className="flex flex-col divide-y divide-yellow-100 dark:divide-yellow-900">
          {items.map((v) => (
            <div key={v.zeichen} className="flex items-center gap-3 px-4 py-2">
              <span className="chinese-text text-xl w-8 text-center text-gray-900 dark:text-gray-100">{v.zeichen}</span>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-400">{v.pinyin}</span>
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{v.deutsch}</p>
              </div>
              <button
                onClick={() => onUnstar(v.zeichen)}
                className="text-yellow-400 text-xl active:scale-90"
                title="Stern entfernen"
              >
                ⭐
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SpieleHubPage() {
  const { vokabelSterne, zeichenSterne, unstarVokabel, unstarZeichen } = useLernen()

  return (
    <div className="flex flex-col gap-5 p-4 pt-6 pb-8 overflow-y-auto">
      <div className="text-center">
        <div className="text-5xl mb-2">🎮</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Lernspiele</h1>
        <p className="text-sm text-gray-400 mt-1">Chinesisch spielerisch üben</p>
      </div>

      {/* Starred sections */}
      <SternSection
        title="Gemerkte Vokabeln"
        icon="⭐"
        to="/spiele/stern-vokabeln"
        items={vokabelSterne}
        onUnstar={unstarVokabel}
        emptyHint="Geh zu Lernen und markiere Vokabeln mit ⭐"
      />
      <SternSection
        title="Gemerkte Zeichen"
        icon="⭐"
        to="/spiele/stern-zeichen"
        items={zeichenSterne}
        onUnstar={unstarZeichen}
        emptyHint="Geh zu Lernen → Zeichen und markiere Zeichen mit ⭐"
      />

      {/* Games */}
      <div className="flex flex-col gap-3">
        {SPIELE.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${s.color} active:scale-[0.98] transition-transform`}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl text-2xl ${s.iconBg}`}>
              {s.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 dark:text-gray-100">{s.title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
