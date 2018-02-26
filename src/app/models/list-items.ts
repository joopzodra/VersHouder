// The id property exists on all existing listItems, except on the newly created ones. Therefore it's an optional property.

export interface PoemsListItem {
  text: string,
  id?: number,
  text_lines?: number, 
  title?: string,
  poet_id?: number,
  bundle_id?: number,
  url?: string,
  url_label?: string,
  comment?: string,
  poet_name?: string,
  bundle_title?: string,
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
  poet_id?: number,
}

export type ListItem = PoemsListItem | PoetsListItem | BundlesListItem;