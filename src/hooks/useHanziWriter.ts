import { useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'

interface UseHanziWriterOptions {
  showCharacter?: boolean
  showOutline?: boolean
  quiz?: boolean
  onQuizComplete?: () => void
  onQuizMistake?: () => void
}

export function useHanziWriter(
  char: string,
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseHanziWriterOptions = {}
) {
  const writerRef = useRef<HanziWriter | null>(null)

  useEffect(() => {
    if (!containerRef.current || !char) return
    containerRef.current.innerHTML = ''

    const writer = HanziWriter.create(containerRef.current, char, {
      width: 280,
      height: 280,
      padding: 10,
      charDataLoader: (c, onLoad, onError) => {
        fetch(`/hanzi-data/${encodeURIComponent(c)}.json`)
          .then((r) => {
            if (!r.ok) throw new Error(`No data for ${c}`)
            return r.json()
          })
          .then(onLoad)
          .catch(onError ?? console.error)
      },
      showCharacter: options.showCharacter ?? true,
      showOutline: options.showOutline ?? true,
      strokeColor: '#1e40af',
      outlineColor: '#cbd5e1',
      drawingColor: '#dc2626',
      highlightColor: '#16a34a',
      drawingFadeDuration: 0,
    })

    writerRef.current = writer

    if (options.quiz) {
      // Small delay to let char data load before starting quiz
      const timeout = setTimeout(() => {
        writer.quiz({
          onMistake: options.onQuizMistake,
          onComplete: options.onQuizComplete,
        })
      }, 800)
      return () => {
        clearTimeout(timeout)
        writerRef.current = null
      }
    }

    return () => {
      writerRef.current = null
    }
  }, [char]) // eslint-disable-line react-hooks/exhaustive-deps

  function animateCharacter() {
    writerRef.current?.animateCharacter()
  }

  function showCharacter() {
    writerRef.current?.showCharacter()
  }

  function hideCharacter() {
    writerRef.current?.hideCharacter()
  }

  return { writerRef, animateCharacter, showCharacter, hideCharacter }
}
