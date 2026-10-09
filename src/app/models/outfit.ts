/** A curated outfit and its original Pinterest source. */
export interface Outfit {
  readonly id: string;
  readonly image: string;
  readonly title: string;
  readonly url: string;
}
export interface OutfitCollection {
  readonly id: string;
  readonly title: string;
  readonly outfits: readonly Outfit[];
}
