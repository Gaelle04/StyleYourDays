import { Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OutfitCollection } from '../../models/outfit';

@Component({
  selector: 'app-outfit-gallery',
  imports: [RouterLink],
  templateUrl: './outfit-gallery.component.html',
  styleUrl: './outfit-gallery.component.css',
})
export class OutfitGalleryComponent {
  readonly collections = input.required<readonly OutfitCollection[]>();
  readonly query = signal('');
  readonly filteredCollections = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    return this.collections().map((collection) => ({
      ...collection,
      outfits: collection.outfits.filter((outfit) =>
        `${outfit.title} ${collection.title}`.toLocaleLowerCase().includes(query),
      ),
    }));
  });
  readonly resultCount = computed(() =>
    this.filteredCollections().reduce((total, collection) => total + collection.outfits.length, 0),
  );
}
