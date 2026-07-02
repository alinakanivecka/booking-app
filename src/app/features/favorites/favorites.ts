import { Component, computed, inject, signal } from '@angular/core';
import { AccommodationsList } from '../../shared/components/accommodations-list/accommodations-list';
import { FavoritesService } from '../../core/services/favorites.service';
import { SnackbarService } from '../../core/services/snackbar.service';

@Component({
  selector: 'app-favorites',
  imports: [AccommodationsList],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  favoritesService = inject(FavoritesService);
  private snackbarService = inject(SnackbarService);

  isLoading = signal(false);
  errorMessage = signal('');
  noResults = computed(() => this.favoritesService.favorites().length === 0);
  totalItems = computed(() => this.favoritesService.favorites().length);

  isFavorite = (accommodationId: number): boolean => {
    return this.favoritesService.isFavorite(accommodationId);
  };

  constructor() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.favoritesService.loadFavorites().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load favorite accommodations');
        this.isLoading.set(false);
      },
    });
  }

  removeFavorite(accommodationId: number) {
    this.favoritesService.removeFavorite(accommodationId).subscribe({
      next: () => {
        this.snackbarService.success('Removed from favorites');
      },
      error: () => {
        this.snackbarService.error('Unable to remove favorite');
      },
    });
  }
}
