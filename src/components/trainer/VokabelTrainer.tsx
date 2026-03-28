import { useState, useCallback } from 'react'
import type { Vokabel } from '../../types/vocabulary'
import { ProgressBar } from '../shared/ProgressBar'
import { ChineseToGermanMode } from './ChineseToGermanMode'
import { GermanToPinyinMode } from './GermanToPinyinMode'
import { GermanToChineseMode } from './GermanToChineseMode'

type Mode = 'chinese-to-german' | 'german-to-pinyin' | 'german-to-chinese'

interface Props {
  words: Vokabel[]
  allWords: Vokabel[]
  onRecord: (zeichen: string, correct: boolean) => void
  onFinish: () => void
}

export function VokabelTrainer({ words, allWords, onRecord, onFinish }: Props) {
  const [mode, setMode] = useState<Mode>('chinese-to-german')
  const [index, setIndex] = useState(0)

  const current = words[index]

  const handleResult = useCallback(
    (correct: boolean) => {
      onRecord(current.zeichen, correct)
      if (index + 1 >= words.length) {
        onFinish()
      } else {
        setIndex((i) => i + 1)
      }
    },
    [current, index, words.length, onRecord, onFinish]
  )

  if (!current) return null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex flex-col gap-2">
        <div className="flex gap-1">
          <button
            onClick={() => setMode('chinese-to-german')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              mode === 'chinese-to-german'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            汉字 → DE
          </button>
          <button
            onClick={() => setMode('german-to-pinyin')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              mode === 'german-to-pinyin'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            DE → Pinyin
          </button>
          <button
            onClick={() => setMode('german-to-chinese')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              mode === 'german-to-chinese'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            DE → 汉字
          </button>
        </div>
        <ProgressBar current={index} total={words.length} />
        <p className="text-xs text-gray-400 text-right">
          {index + 1} / {words.length}
        </p>
      </div>

      {/* Card area — key forces remount on word change */}
      <div className="flex-1">
        {mode === 'chinese-to-german' ? (
          <ChineseToGermanMode key={current.zeichen + index} word={current} onResult={handleResult} />
        ) : mode === 'german-to-pinyin' ? (
          <GermanToPinyinMode key={current.zeichen + index} word={current} onResult={handleResult} />
        ) : (
          <GermanToChineseMode key={current.zeichen + index} word={current} allWords={allWords} onResult={handleResult} />
        )}
      </div>
    </div>
  )
}
