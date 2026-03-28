let state: 'idle' | 'loading' | 'loaded' | 'error' = 'idle'
const callbacks: Array<() => void> = []

export function loadHanziLookup(): Promise<void> {
  if (state === 'loaded') return Promise.resolve()
  if (state === 'error') return Promise.reject(new Error('HanziLookup failed to load'))

  return new Promise<void>((resolve, reject) => {
    callbacks.push(() => {
      if (state === 'loaded') resolve()
      else reject(new Error('HanziLookup failed to load'))
    })

    if (state === 'loading') return

    state = 'loading'
    const script = document.createElement('script')
    const base = import.meta.env.BASE_URL
    script.src = `${base}hanzi-lookup/HanziLookupJS.js`
    script.onload = () => {
      HanziLookup.init('mmah', `${base}hanzi-lookup/mmah.json`, () => {
        state = 'loaded'
        callbacks.forEach((cb) => cb())
        callbacks.length = 0
      })
    }
    script.onerror = () => {
      state = 'error'
      callbacks.forEach((cb) => cb())
      callbacks.length = 0
    }
    document.head.appendChild(script)
  })
}

export function isHanziLookupLoaded(): boolean {
  return state === 'loaded'
}
