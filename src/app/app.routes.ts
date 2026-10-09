import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'SYD',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    title: 'About | SYD',
    loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'foryou',
    title: 'For You | SYD',
    loadComponent: () => import('./pages/for-you/for-you.component').then((m) => m.ForYouComponent),
  },
  {
    path: 'latesttrends',
    title: 'The Latest Trends | SYD',
    loadComponent: () =>
      import('./pages/latest-trends/latest-trends.component').then((m) => m.LatestTrendsComponent),
  },
  {
    path: '**',
    title: 'Page not found | SYD',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
