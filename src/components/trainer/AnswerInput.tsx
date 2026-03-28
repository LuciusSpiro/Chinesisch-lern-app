import { useRef, useEffect, type FormEvent } from 'react'

interface Props {
  placeholder: string
  hint?: string
  onSubmit: (value: string) => void
  disabled?: boolean
}

export function AnswerInput({ placeholder, hint, onSubmit, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const val = inputRef.current?.value.trim() ?? ''
    if (val) onSubmit(val)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      />
      {hint && <p className="text-sm text-gray-400 text-center">{hint}</p>}
      <button
        type="submit"
        disabled={disabled}
        className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold text-lg active:scale-95 transition-transform disabled:opacity-50"
      >
        Prüfen
      </button>
    </form>
  )
}
