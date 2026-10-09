import { Component } from '@angular/core';
import { LATEST_TRENDS_COLLECTIONS } from '../../data/outfits';
import { SiteHeaderComponent } from '../../shared/site-header/site-header.component';
import { OutfitGalleryComponent } from '../../shared/outfit-gallery/outfit-gallery.component';

@Component({
  selector: 'app-latest-trends',
  imports: [SiteHeaderComponent, OutfitGalleryComponent],
  templateUrl: './latest-trends.component.html',
})
export class LatestTrendsComponent {
  readonly collections = LATEST_TRENDS_COLLECTIONS;
}
