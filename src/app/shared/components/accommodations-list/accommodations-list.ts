import { Component, input } from '@angular/core';
import { Items } from '../../../models/accommodations.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-accommodations-list',
  imports: [],
  templateUrl: './accommodations-list.html',
  styleUrl: './accommodations-list.scss',
})
export class AccommodationsList {
  isLoading = input.required<boolean>();
  errorMessage = input.required<string>();
  accItems = input.required<Items[]>();

  getImageUrl(item: Items): string {
    const firstImage = item.images[0];

    if (!firstImage) {
      return 'assets/no-image.png';
    }

    return `${environment.apiUrl}${firstImage}`;
  }
}
