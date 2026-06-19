import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccommodationsResponse, Accommodation } from '../../models/accommodations.model';
import { environment } from '../../../environments/environment';
import { FiltersType } from '../../models/filters-type.model';

@Injectable({
  providedIn: 'root',
})
export class AccommodationsService {
  private http = inject(HttpClient);

  getAccommodations(filters: FiltersType): Observable<AccommodationsResponse> {
    let params = new HttpParams().set('page', filters.page).set('pageSize', filters.pageSize);

    if (filters.city) {
      params = params.set('city', filters.city);
    }

    if (filters.country) {
      params = params.set('country', filters.country);
    }

    if (filters.guests != null) {
      params = params.set('guests', filters.guests);
    }

    if (filters.minPrice != null) {
      params = params.set('minPrice', filters.minPrice);
    }

    if (filters.maxPrice != null) {
      params = params.set('maxPrice', filters.maxPrice);
    }

    if (filters.checkIn) {
      params = params.set('checkIn', filters.checkIn);
    }

    if (filters.checkOut) {
      params = params.set('checkOut', filters.checkOut);
    }

    if (filters.amenities?.length) {
      params = params.set('amenities', filters.amenities.join(','));
    }

    if (filters.sort) {
      params = params.set('sort', filters.sort);
    }

    return this.http.get<AccommodationsResponse>(`${environment.apiUrl}/accommodations`, {
      params,
    });
  }

  getAccommodationDetails(id: number): Observable<Accommodation> {
    return this.http.get<Accommodation>(`${environment.apiUrl}/accommodations/${id}`);
  }

  getImageUrl(item: Accommodation): string {
    const firstImage = item.images[0];

    if (!firstImage) {
      return 'assets/no-image.png';
    }

    return `${environment.apiUrl}${firstImage}`;
  }

  

  replaceAmenity(amenity: string): string {
    return amenity.replaceAll('_', ' ');
  }
}
