import { Routes } from '@angular/router';
import { NotFound } from './features/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';
import { authRoutes } from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },

  {
    path: 'search',
    loadComponent: () => import('./features/search/search').then((c) => c.Search),
  },

  {
    path: 'accommodation/:id',
    loadComponent: () =>
      import('./features/accommodation-details-page/accommodation-details-page').then(
        (c) => c.AccommodationDetailsPage,
      ),
  },

  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.authRoutes),
  },

  {
    path: 'bookings',
    loadComponent: () => import('./features/bookings/bookings').then((c) => c.Bookings),
    canActivate: [authGuard],
  },

  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites').then((c) => c.Favorites),
    canActivate: [authGuard],
  },

  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () => import('./features/auth/auth.routes').then((r) => r.authRoutes),
  },

  {
    path: 'host/dashboard',
    redirectTo: 'search',
  },

  {
    path: 'host/accommodations',
    redirectTo: 'search',
  },

  {
    path: 'host/accommodations/new',
    redirectTo: 'search',
  },

  {
    path: 'host/accommodations/:id/edit',
    redirectTo: 'search',
  },

  {
    path: 'host/bookings',
    redirectTo: 'search',
  },

  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((c) => c.NotFound),
  },
];
