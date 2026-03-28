import { useState } from 'react'
import type { Vokabel } from '../../types/vocabulary'
import { germanMatchesExpected } from '../../lib/fuzzyMatch'
import { ResultFeedback } from '../shared/ResultFeedback'
import { AnswerInput } from './AnswerInput'

interface Props {
  word: Vokabel
  onResult: (correct: boolean) => void
}

export function ChineseToGermanMode({ word, onResult }: Props) {
  const [result, setResult] = useState<boolean | null>(null)

  function handleSubmit(value: string) {
    const correct = germanMatchesExpected(value, word.deutsch)
    setResult(correct)
  }

  function handleNext() {
    setResult(null)
    onResult(result!)
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6 pt-10">
      {/* Character display */}
      <div className="chinese-text text-8xl font-thin text-center leading-none">
        {word.zeichen}
      </div>
      <div className="text-gray-500 dark:text-gray-400 text-xl tracking-widest">{word.pinyin}</div>

      {/* Component hints */}
      {word.komponenten && Object.keys(word.komponenten).length > 0 && (
        <details className="w-full text-sm text-gray-400 dark:text-gray-500">
          <summary className="cursor-pointer text-center">Zeichen-Hinweise anzeigen</summary>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {Object.entries(word.komponenten).map(([ch, k]) => (
              <div key={ch} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center">
                <span className="chinese-text text-lg text-gray-800 dark:text-gray-100">{ch}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">{k.deutsch}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      <AnswerInput
        placeholder="Deutsche Übersetzung…"
        onSubmit={handleSubmit}
        disabled={result !== null}
      />

      {result !== null && (
        <ResultFeedback
          correct={result}
          correctAnswer={word.deutsch}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
