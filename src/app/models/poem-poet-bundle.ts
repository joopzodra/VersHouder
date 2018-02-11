export interface Poem {
  text: string,
  title?: string,
  poetId?: number,
  bundleId?: number,
  url?: string,
  comment?: string,
  userId?: number
}

export interface Poet {
  name: string,
  born?: number,
  died?: number,
  userId?: number
}

export interface Bundle {
  title: string,
  year?: number,
  poetId?: number,
  userId?: number
}
