import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Accommodation } from '../../models/accommodations.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);

  addFavorite(accommodationId: number) {
    return this.http.post<Accommodation>(`${environment.apiUrl}/favorites/${accommodationId}`, {});
  }

  deleteFavorite(accommodationId: number) {
    return this.http.delete<Accommodation>(
      `${environment.apiUrl}/favorites/${accommodationId}`,
      {},
    );
  }
}
