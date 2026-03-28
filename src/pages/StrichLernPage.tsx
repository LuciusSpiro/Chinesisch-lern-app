import { useState } from 'react'
import { useVocabulary } from '../hooks/useVocabulary'
import { useProgress } from '../hooks/useProgress'
import { StrichLernTrainer } from '../components/trainer/StrichLernTrainer'

const SESSION_SIZE = 10

export function StrichLernPage() {
  const { getWordsForSession } = useVocabulary()
  const { store, record } = useProgress()
  const [words] = useState(() => getWordsForSession(SESSION_SIZE, 'due-first', store, 'trace'))
  const [done, setDone] = useState(false)
  const [sessionKey, setSessionKey] = useState(0)

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-6">
        <div className="text-6xl">✍️</div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Toll gemacht!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">{SESSION_SIZE} Zeichen gelernt</p>
        <button
          onClick={() => { setDone(false); setSessionKey((k) => k + 1) }}
          className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold text-lg active:scale-95"
        >
          Neue Session
        </button>
      </div>
    )
  }

  return (
    <StrichLernTrainer
      key={sessionKey}
      words={words}
      onRecord={(z, c) => record(z, 'trace', c)}
      onFinish={() => setDone(true)}
    />
  )
}
