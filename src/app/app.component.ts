import { DOCUMENT } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <a class="skip-link" [routerLink]="[]" fragment="main-content" (click)="focusMainContent()">
      Skip to content
    </a>
    <router-outlet />
  `,
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);

  focusMainContent(): void {
    this.document.getElementById('main-content')?.focus();
  }
}
