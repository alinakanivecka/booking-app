import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AccommodationsService } from '../../core/services/accommodations.service';
import { N } from '@angular/cdk/keycodes';
import { Item } from '../../models/accommodations.model';

@Component({
  selector: 'app-accommodation-details-page',
  imports: [],
  templateUrl: './accommodation-details-page.html',
  styleUrl: './accommodation-details-page.scss',
})
export class AccommodationDetailsPage {
  private accommodationService = inject(AccommodationsService);
  accommodation = signal<Item | null>(null);

  isLoading = signal(false);
  noResults = signal(false);
  errorMessage = signal('');

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = Number(params.get('id'));

      this.isLoading.set(true);

      this.accommodationService.getAccommodationDetails(id).subscribe({
        next: (response) => {
          this.accommodation.set(response);
          console.log(response);
        },
      });
    });
  }

  getImageUrl(item: Item): string {
    return this.accommodationService.getImageUrl(item);
  }

  replaceAmenity(ammenity: string): string {
    return this.accommodationService.replaceAmenity(ammenity);
  }
}
