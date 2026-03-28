import { useState, useRef, useEffect, useCallback } from 'react'
import type { Vokabel } from '../../types/vocabulary'
import { loadHanziLookup } from '../../lib/hanziLookupLoader'
import { ProgressBar } from '../shared/ProgressBar'
import { DrawingCanvas, type DrawingCanvasHandle } from './DrawingCanvas'
import { HanziWriterDisplay } from '../stroke-trace/HanziWriterDisplay'

type Phase = 'drawing' | 'result'

interface RecognitionMatch {
  character: string
  score: number
}

interface Props {
  words: Vokabel[]  // only single-char words
  onRecord: (zeichen: string, correct: boolean) => void
  onFinish: () => void
}

export function ZeichenSchreibTrainer({ words, onRecord, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('drawing')
  const [matches, setMatches] = useState<RecognitionMatch[]>([])
  const [lookupReady, setLookupReady] = useState(false)
  const [lookupError, setLookupError] = useState(false)
  const canvasRef = useRef<DrawingCanvasHandle>(null)

  const current = words[index]

  useEffect(() => {
    loadHanziLookup()
      .then(() => setLookupReady(true))
      .catch(() => setLookupError(true))
  }, [])

  const handleCheck = useCallback(() => {
    if (!lookupReady || !current) return
    const strokes = canvasRef.current?.getStrokes() ?? []
    if (strokes.length === 0) return

    try {
      const analyzedChar = new HanziLookup.AnalyzedCharacter(strokes)
      const matcher = new HanziLookup.Matcher('mmah')
      matcher.match(analyzedChar, 8, (results) => {
        setMatches(results.slice(0, 3))
        setPhase('result')
      })
    } catch (err) {
      console.error('HanziLookup error:', err)
    }
  }, [lookupReady, current])

  const handleNext = useCallback(
    (correct: boolean) => {
      onRecord(current.zeichen, correct)
      if (index + 1 >= words.length) {
        onFinish()
      } else {
        setIndex((i) => i + 1)
        setPhase('drawing' as Phase)
        setMatches([])
        canvasRef.current?.clear()
      }
    },
    [current, index, words.length, onRecord, onFinish]
  )

  if (!current) return null

  const topMatch = matches[0]
  const isCorrect = topMatch?.character === current.zeichen

  return (
    <div className="flex flex-col items-center gap-4 p-4 pt-6">
      {/* Progress */}
      <div className="w-full flex flex-col gap-1">
        <ProgressBar current={index} total={words.length} />
        <p className="text-xs text-gray-400 text-right">{index + 1} / {words.length}</p>
      </div>

      {/* Prompt */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-gray-800">{current.deutsch}</p>
        <p className="text-sm text-gray-400 mt-1">{current.pinyin}</p>
      </div>

      {lookupError && (
        <div className="w-full bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
          Erkennung nicht verfügbar — HanziLookupJS nicht geladen.
          <br />Stelle sicher, dass <code>public/hanzi-lookup/HanziLookupJS.js</code> vorhanden ist.
        </div>
      )}

      {/* Drawing canvas */}
      {phase !== 'result' && (
        <>
          <DrawingCanvas ref={canvasRef} size={300} disabled={false} />
          <div className="flex gap-3 w-full">
            <button
              onClick={() => canvasRef.current?.clear()}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium active:scale-95 transition-transform"
            >
              Löschen
            </button>
            <button
              onClick={handleCheck}
              disabled={!lookupReady || lookupError}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold active:scale-95 transition-transform disabled:opacity-50"
            >
              Prüfen
            </button>
          </div>
        </>
      )}

      {/* Result */}
      {phase === 'result' && (
        <div className="w-full flex flex-col items-center gap-4">
          {/* Correctness banner */}
          <div className={`w-full py-3 rounded-xl text-center font-bold text-lg ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isCorrect ? '✓ Richtig!' : '✗ Falsch'}
          </div>

          {/* Correct character shown via hanzi-writer */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm text-gray-400">Korrektes Zeichen:</p>
            <HanziWriterDisplay char={current.zeichen} size={200} />
          </div>

          {/* Top candidates */}
          {matches.length > 0 && (
            <div className="w-full">
              <p className="text-sm text-gray-400 mb-2">Erkannte Kandidaten:</p>
              <div className="flex gap-2">
                {matches.map((m, i) => (
                  <div
                    key={m.character}
                    className={`flex-1 flex flex-col items-center p-3 rounded-xl border-2 ${
                      m.character === current.zeichen
                        ? 'border-green-400 bg-green-50'
                        : i === 0
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <span className="chinese-text text-3xl">{m.character}</span>
                    <span className="text-xs text-gray-400 mt-1">{Math.round(m.score * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 w-full">
            <button
              onClick={() => handleNext(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
            >
              Falsch werten
            </button>
            <button
              onClick={() => handleNext(true)}
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold"
            >
              Richtig werten
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
