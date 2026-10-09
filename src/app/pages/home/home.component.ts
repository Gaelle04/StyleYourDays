import { Component } from '@angular/core';
import { SiteHeaderComponent } from '../../shared/site-header/site-header.component';
import { SiteFooterComponent } from '../../shared/site-footer/site-footer.component';

@Component({
  selector: 'app-home',
  imports: [SiteHeaderComponent, SiteFooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
