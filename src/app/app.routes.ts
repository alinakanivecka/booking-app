import { Routes } from '@angular/router';
import { NotFound } from './features/not-found/not-found';
import { authGuard } from './core/guards/auth-guard';
import { Search } from './features/search/search';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },

  {
    path: 'search',
    loadComponent: () => import('./features/search/search').then((c) => Search),
  },

  {
    path: 'accommodation/:id',
  },
  {
    path: 'login',
  },
  {
    path: 'register',
  },
  {
    path: 'bookings',
  },
  {
    path: 'favorites',
  },
  {
    path: 'profile',
    canActivate: [authGuard],
  },

  {
    path: 'host/dashboard',
  },
  {
    path: 'host/accommodations',
  },
  {
    path: 'host/accommodations/new',
  },
  {
    path: 'host/accommodations/:id/edit',
  },
  {
    path: 'host/bookings',
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((c) => NotFound),
  },
];
