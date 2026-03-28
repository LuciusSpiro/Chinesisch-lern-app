import { useRef } from 'react'
import { useHanziWriter } from '../../hooks/useHanziWriter'

interface Props {
  char: string
  quiz?: boolean
  onQuizComplete?: () => void
  onQuizMistake?: () => void
  size?: number
}

export function HanziWriterDisplay({
  char,
  quiz = false,
  onQuizComplete,
  onQuizMistake,
  size = 280,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  useHanziWriter(char, containerRef, {
    showCharacter: !quiz,
    showOutline: true,
    quiz,
    onQuizComplete,
    onQuizMistake,
  })

  return (
    <div
      ref={containerRef}
      style={{ width: size, height: size }}
      className="rounded-2xl bg-white dark:bg-gray-800 shadow-inner border border-gray-100 dark:border-gray-700"
    />
  )
}
