import { Component, inject, input } from '@angular/core';
import { Item } from '../../../models/accommodations.model';
import { environment } from '../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { AccommodationsService } from '../../../core/services/accommodations.service';

@Component({
  selector: 'app-accommodations-list',
  imports: [RouterLink],
  templateUrl: './accommodations-list.html',
  styleUrl: './accommodations-list.scss',
})
export class AccommodationsList {
  private accommodationService = inject(AccommodationsService);

  isLoading = input.required<boolean>();
  errorMessage = input.required<string>();
  accItems = input.required<Item[]>();
  totalItems = input.required<number>();
  getDestinationName = input.required<string | undefined>();
  noResults = input.required();

  getImageUrl(item: Item): string {
    return this.accommodationService.getImageUrl(item);
  }

  replaceAmenity(ammenity: string): string {
    return this.accommodationService.replaceAmenity(ammenity)
  }
}
