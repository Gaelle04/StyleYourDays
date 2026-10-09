import { Component } from '@angular/core';
import { FOR_YOU_COLLECTIONS } from '../../data/outfits';
import { SiteHeaderComponent } from '../../shared/site-header/site-header.component';
import { OutfitGalleryComponent } from '../../shared/outfit-gallery/outfit-gallery.component';

@Component({
  selector: 'app-for-you',
  imports: [SiteHeaderComponent, OutfitGalleryComponent],
  templateUrl: './for-you.component.html',
})
export class ForYouComponent {
  readonly collections = FOR_YOU_COLLECTIONS;
}
