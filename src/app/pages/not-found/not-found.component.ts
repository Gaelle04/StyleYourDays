import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/site-header/site-header.component';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, SiteHeaderComponent],
  template:
    '<app-site-header /><main id="main-content" class="page-content" tabindex="-1"><h1>Page not found</h1><p>This page does not exist.</p><a routerLink="/">Return home</a></main>',
})
export class NotFoundComponent {}
