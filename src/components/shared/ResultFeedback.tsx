interface Props {
  correct: boolean
  correctAnswer: string
  label?: string
  onNext: () => void
}

export function ResultFeedback({ correct, correctAnswer, label = 'Richtige Antwort:', onNext }: Props) {
  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 p-6 ${
        correct ? 'bg-green-500' : 'bg-red-500'
      } bg-opacity-95`}
    >
      <div className="text-6xl">{correct ? '✓' : '✗'}</div>
      <div className="text-white text-2xl font-bold">{correct ? 'Richtig!' : 'Falsch!'}</div>
      {!correct && (
        <div className="text-center text-white">
          <div className="text-sm opacity-80">{label}</div>
          <div className="text-xl font-semibold mt-1 chinese-text">{correctAnswer}</div>
        </div>
      )}
      <button
        onClick={onNext}
        className="mt-4 px-8 py-3 bg-white text-gray-900 rounded-full font-semibold text-lg shadow-lg active:scale-95 transition-transform"
      >
        Weiter
      </button>
    </div>
  )
}
