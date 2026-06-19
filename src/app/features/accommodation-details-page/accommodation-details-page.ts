import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AccommodationsService } from '../../core/services/accommodations.service';
import { N } from '@angular/cdk/keycodes';
import { Accommodation } from '../../models/accommodations.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-accommodation-details-page',
  imports: [],
  templateUrl: './accommodation-details-page.html',
  styleUrl: './accommodation-details-page.scss',
})
export class AccommodationDetailsPage {
  private accommodationService = inject(AccommodationsService);
  accommodation = signal<Accommodation | null>(null);

  isLoading = signal(false);
  noResults = signal(false);
  errorMessage = signal('');

  selectedImage = signal<string | null>(null);

  selectImage(image: string) {
    this.selectedImage.set(image);
  }

  getMainImage(accommodation: Accommodation): string {
    const image = this.selectedImage() || accommodation.images?.[0];

    return image ? `${environment.apiUrl}${image}` : 'assets/placeholder.jpg';
  }

  getImageUrlByPath(image: string): string {
    return `${environment.apiUrl}${image}`;
  }

  replaceAmenity(ammenity: string): string {
    return this.accommodationService.replaceAmenity(ammenity);
  }

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = Number(params.get('id'));

      this.isLoading.set(true);

      this.accommodationService.getAccommodationDetails(id).subscribe({
        next: (response) => {
          this.accommodation.set(response);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
          this.errorMessage.set('Unable to load accommodation');
        },
      });
    });
  }
}
