import { useState, useCallback } from 'react'
import type { Vokabel } from '../../types/vocabulary'
import { ProgressBar } from '../shared/ProgressBar'
import { HanziWriterDisplay } from './HanziWriterDisplay'

interface Props {
  words: Vokabel[]
  onRecord: (zeichen: string, correct: boolean) => void
  onFinish: () => void
}

export function ZeichenAbmalTrainer({ words, onRecord, onFinish }: Props) {
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [quizKey, setQuizKey] = useState(0)

  const currentWord = words[wordIndex]
  const chars = currentWord ? currentWord.zeichen.split('') : []
  const currentChar = chars[charIndex] ?? ''

  const handleMistake = useCallback(() => {
    setMistakes((m) => m + 1)
  }, [])

  const handleCharComplete = useCallback(() => {
    if (charIndex + 1 < chars.length) {
      // Next character in the same word
      setCharIndex((i) => i + 1)
      setMistakes(0)
      setQuizKey((k) => k + 1)
    } else {
      // Word done
      const correct = mistakes <= 1
      onRecord(currentWord.zeichen, correct)
      if (wordIndex + 1 >= words.length) {
        onFinish()
      } else {
        setWordIndex((i) => i + 1)
        setCharIndex(0)
        setMistakes(0)
        setQuizKey((k) => k + 1)
      }
    }
  }, [charIndex, chars.length, mistakes, currentWord, wordIndex, words.length, onRecord, onFinish])

  if (!currentWord || !currentChar) return null

  return (
    <div className="flex flex-col items-center gap-4 p-4 pt-6">
      {/* Header */}
      <div className="w-full flex flex-col gap-2">
        <ProgressBar current={wordIndex} total={words.length} />
        <p className="text-xs text-gray-400 text-right">
          {wordIndex + 1} / {words.length}
        </p>
      </div>

      {/* Word info */}
      <div className="text-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">{currentWord.deutsch}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 tracking-widest">{currentWord.pinyin}</p>
      </div>

      {/* Character indicator for multi-char words */}
      {chars.length > 1 && (
        <div className="flex gap-2">
          {chars.map((ch, i) => (
            <div
              key={i}
              className={`w-10 h-10 flex items-center justify-center rounded-lg text-lg chinese-text border-2 ${
                i === charIndex
                  ? 'border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
                  : i < charIndex
                  ? 'border-green-400 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400'
              }`}
            >
              {ch}
            </div>
          ))}
        </div>
      )}

      {/* Tracing area */}
      <HanziWriterDisplay
        key={`${quizKey}-${currentChar}`}
        char={currentChar}
        quiz={true}
        onQuizComplete={handleCharComplete}
        onQuizMistake={handleMistake}
        size={300}
      />

      <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
        Male die Striche in der richtigen Reihenfolge
      </p>

      {mistakes > 0 && (
        <p className="text-xs text-orange-500">{mistakes} Fehler bisher</p>
      )}
    </div>
  )
}
