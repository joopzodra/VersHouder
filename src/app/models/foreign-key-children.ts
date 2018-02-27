export interface Poet {
  id: number,
  name: string,
  born?: number,
  died?: number,
}

export interface Bundle {
  id: number,
  title: string,
  year?: number,
  poet_id?: number
}