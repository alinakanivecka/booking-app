import { Component, inject, input, output } from '@angular/core';
import { Accommodation } from '../../../models/accommodations.model';
import { RouterLink } from '@angular/router';
import { AccommodationsService } from '../../../core/services/accommodations.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-accommodations-list',
  imports: [RouterLink],
  templateUrl: './accommodations-list.html',
  styleUrl: './accommodations-list.scss',
})
export class AccommodationsList {
  private accommodationService = inject(AccommodationsService);
  authService = inject(AuthService);

  isLoading = input.required<boolean>();
  errorMessage = input.required<string>();
  accItems = input.required<Accommodation[]>();
  totalItems = input<number>();
  noResults = input.required();
  emptyTitle = input('No properties found');
  emptyState = input<'search' | 'favorites'>('search');
  isFavorite = input<(id: number) => boolean>(() => false);

  toggleFavorite = output<number>();

  favoriteClicked(accommodationId: number) {
    this.toggleFavorite.emit(accommodationId);
  }

  getImageUrl(item: Accommodation): string {
    return this.accommodationService.getImageUrl(item);
  }

  accommodationRatingLabel(item: Accommodation) {
    return this.accommodationService.getAccommodationRating(item);
  }

  replaceAmenity(ammenity: string): string {
    return this.accommodationService.replaceAmenity(ammenity);
  }
}
