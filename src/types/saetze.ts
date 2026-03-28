export interface Luecke {
  wort: string
  position: number
  alternativen: string[]
}

export interface Satz {
  id: string
  zeichen: string
  pinyin: string
  deutsch: string
  woerter: string[]
  luecke: Luecke
}
