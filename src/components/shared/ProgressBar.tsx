interface Props {
  current: number
  total: number
}

export function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className="bg-red-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
