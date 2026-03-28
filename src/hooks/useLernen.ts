import { useState, useCallback } from 'react'
import {
  loadLernen,
  saveLernen,
  starVokabel,
  unstarVokabel,
  starZeichen,
  unstarZeichen,
  getVokabelByZeichen,
  type LernenStore,
} from '../lib/lernen'
import type { Vokabel } from '../types/vocabulary'

export function useLernen() {
  const [store, setStore] = useState<LernenStore>(() => loadLernen())

  function update(next: LernenStore) {
    saveLernen(next)
    setStore(next)
  }

  const doStarVokabel = useCallback((zeichen: string) => {
    setStore((s) => { const n = starVokabel(s, zeichen); saveLernen(n); return n })
  }, [])

  const doUnstarVokabel = useCallback((zeichen: string) => {
    setStore((s) => { const n = unstarVokabel(s, zeichen); saveLernen(n); return n })
  }, [])

  const doStarZeichen = useCallback((zeichen: string) => {
    setStore((s) => { const n = starZeichen(s, zeichen); saveLernen(n); return n })
  }, [])

  const doUnstarZeichen = useCallback((zeichen: string) => {
    setStore((s) => { const n = unstarZeichen(s, zeichen); saveLernen(n); return n })
  }, [])

  const vokabelPool: Vokabel[] = store.vokabelPool
    .map(getVokabelByZeichen)
    .filter((v): v is Vokabel => v !== undefined)

  const vokabelSterne: Vokabel[] = store.vokabelSterne
    .map(getVokabelByZeichen)
    .filter((v): v is Vokabel => v !== undefined)

  const zeichenPool: Vokabel[] = store.zeichenPool
    .map(getVokabelByZeichen)
    .filter((v): v is Vokabel => v !== undefined)

  const zeichenSterne: Vokabel[] = store.zeichenSterne
    .map(getVokabelByZeichen)
    .filter((v): v is Vokabel => v !== undefined)

  return {
    vokabelPool,
    vokabelSterne,
    zeichenPool,
    zeichenSterne,
    starVokabel: doStarVokabel,
    unstarVokabel: doUnstarVokabel,
    starZeichen: doStarZeichen,
    unstarZeichen: doUnstarZeichen,
    update,
  }
}
