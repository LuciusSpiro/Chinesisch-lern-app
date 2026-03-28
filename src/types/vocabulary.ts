export interface Komponente {
  pinyin: string
  deutsch: string
}

export interface Vokabel {
  zeichen: string
  pinyin: string
  deutsch: string
  komponenten?: Record<string, Komponente>
}
