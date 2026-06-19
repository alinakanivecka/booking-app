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
  totalItems = input.required<number>();
  getDestinationName = input.required<string | undefined>();
  noResults = input.required();
  isFavorite = input.required<(id: number) => boolean>();

  toggleFavorite = output<number>();

  favoriteClicked(accommodationId: number) {
    this.toggleFavorite.emit(accommodationId);
  }

  getImageUrl(item: Accommodation): string {
    return this.accommodationService.getImageUrl(item);
  }

  replaceAmenity(ammenity: string): string {
    return this.accommodationService.replaceAmenity(ammenity);
  }
}
