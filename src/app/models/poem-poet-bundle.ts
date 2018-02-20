export interface Poem {
  id: number,
  text: string,
  title?: string,
  poetId?: number,
  bundleId?: number,
  url?: string,
  comment?: string,
  userId?: number
}

export interface Poet {
  id: number,
  name: string,
  born?: number,
  died?: number,
  userId?: number
}

export interface Bundle {
  id: number,
  title: string,
  year?: number,
  poetId?: number,
  userId?: number
}
