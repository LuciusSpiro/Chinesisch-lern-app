import { useState } from 'react'
import type { Vokabel } from '../../types/vocabulary'
import { pinyinEqual } from '../../lib/pinyin'
import { ResultFeedback } from '../shared/ResultFeedback'
import { AnswerInput } from './AnswerInput'

interface Props {
  word: Vokabel
  onResult: (correct: boolean) => void
}

export function GermanToPinyinMode({ word, onResult }: Props) {
  const [result, setResult] = useState<boolean | null>(null)

  function handleSubmit(value: string) {
    const correct = pinyinEqual(value, word.pinyin)
    setResult(correct)
  }

  function handleNext() {
    setResult(null)
    onResult(result!)
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6 pt-10">
      {/* German word */}
      <div className="text-3xl font-semibold text-center text-gray-800 dark:text-gray-100 leading-snug">
        {word.deutsch}
      </div>

      {/* Zeichen hint (blurred, tap to reveal) */}
      <details className="text-center">
        <summary className="cursor-pointer text-sm text-gray-400 dark:text-gray-500">Zeichen anzeigen</summary>
        <div className="mt-2 chinese-text text-6xl text-gray-700 dark:text-gray-300">{word.zeichen}</div>
      </details>

      <AnswerInput
        placeholder="Pinyin eingeben…"
        hint="Töne weglassen ist OK — z.B. 'anjing' für ānjìng"
        onSubmit={handleSubmit}
        disabled={result !== null}
      />

      {result !== null && (
        <ResultFeedback
          correct={result}
          correctAnswer={word.pinyin}
          label="Korrektes Pinyin:"
          onNext={handleNext}
        />
      )}
    </div>
  )
}
