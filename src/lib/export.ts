import type { ProgressStore } from './progress'

export function exportProgress(store: ProgressStore): void {
  const json = JSON.stringify(store, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `hsk-b1-fortschritt-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importProgress(
  file: File,
  onSuccess: (store: ProgressStore) => void,
  onError: (msg: string) => void
): void {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target?.result as string) as unknown
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        (parsed as Record<string, unknown>).version !== 1 ||
        typeof (parsed as Record<string, unknown>).words !== 'object'
      ) {
        onError('Ungültige Datei — kein gültiger HSK-Fortschritt.')
        return
      }
      onSuccess(parsed as ProgressStore)
    } catch {
      onError('Datei konnte nicht gelesen werden.')
    }
  }
  reader.readAsText(file)
}
