export interface PoemsListItem {
  id: number,
  text: string,  
  bundle_id?: number,
  bundle_title?: string,
  poet_id?: number,
  poet_name?: string,
  title?: string,
  //userId?: number
}

export interface PoetsListItem {
  id: number,
  name: string,
  born?: number,
  died?: number,
  ///userId?: number !!!!!!!!!!!!!!
}

export interface BundlesListItem {
  id: number,
  title: string,
  year?: number,
  poetId?: number,
  //userId?: number
}
