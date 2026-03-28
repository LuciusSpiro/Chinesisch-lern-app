import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLernen } from '../hooks/useLernen'
import { useProgress } from '../hooks/useProgress'
import { ZeichenAbmalTrainer } from '../components/stroke-trace/ZeichenAbmalTrainer'

export function SternZeichnenPage() {
  const { zeichenSterne } = useLernen()
  const { record } = useProgress()
  const [done, setDone] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)

  if (zeichenSterne.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
        <div className="text-5xl">⭐</div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Keine gesternten Zeichen</h2>
        <p className="text-gray-500 dark:text-gray-400">Geh zu Lernen → Zeichen und markiere Zeichen mit ⭐</p>
        <Link to="/lernen" className="px-6 py-2 bg-red-600 text-white rounded-full font-semibold active:scale-95">
          Zu Lernen
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="text-6xl">✏️</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gut gemacht!</h2>
        <button
          onClick={() => { setDone(false); setSessionKey((k) => k + 1) }}
          className="px-8 py-3 bg-red-600 text-white rounded-full font-semibold text-lg active:scale-95"
        >
          Nochmal
        </button>
      </div>
    )
  }

  return (
    <ZeichenAbmalTrainer
      key={sessionKey}
      words={zeichenSterne}
      onRecord={(z, c) => record(z, 'trace', c)}
      onFinish={() => setDone(true)}
    />
  )
}
