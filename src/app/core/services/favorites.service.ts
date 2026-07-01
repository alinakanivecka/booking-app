import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Accommodation } from '../../models/accommodations.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);

  readonly favoriteIds = signal<Set<number>>(new Set());
  readonly favorites = signal<Accommodation[]>([]);

  isFavorite = (id: number): boolean => {
    return this.favoriteIds().has(id);
  };

  loadFavorites() {
    return this.http.get<Accommodation[]>(`${environment.apiUrl}/favorites`).pipe(
      tap((favorites) => {
        this.favorites.set(favorites);
        this.favoriteIds.set(new Set(favorites.map((item) => item.id)));
      }),
    );
  }

  addFavorite(accommodationId: number) {
    return this.http.post<void>(`${environment.apiUrl}/favorites/${accommodationId}`, {}).pipe(
      tap(() => {
        this.favoriteIds.update((ids) => {
          const updated = new Set(ids);
          updated.add(accommodationId);
          return updated;
        });
      }),
    );
  }

  removeFavorite(accommodationId: number) {
    return this.http.delete<void>(`${environment.apiUrl}/favorites/${accommodationId}`, {}).pipe(
      tap(() => {
        this.favoriteIds.update((ids) => {
          const updated = new Set(ids);
          updated.delete(accommodationId);
          return updated;
        });

        this.favorites.update((items) => items.filter((item) => item.id !== accommodationId));
      }),
    );
  }

  clearFavorites() {
    this.favoriteIds.set(new Set());
    this.favorites.set([]);
  }
}
