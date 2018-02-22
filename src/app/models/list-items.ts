// The id property exists on all existing listItems, except on the newly created ones. Therefore it's an optional property.

export interface PoemsListItem {
  text: string,  
  id?: number,
  bundle_id?: number,
  bundle_title?: string,
  poet_id?: number,
  poet_name?: string,
  title?: string,
}

export interface PoetsListItem {
  name: string,
  id?: number,
  born?: number,
  died?: number,
}

export interface BundlesListItem {
  title: string,
  id?: number,
  year?: number,
  poetId?: number,
}

export type ListItem = PoemsListItem | PoetsListItem | BundlesListItem;