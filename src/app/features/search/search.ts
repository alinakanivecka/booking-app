import {
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { AccommodationsService } from '../../core/services/accommodations.service';
import { Accommodation } from '../../models/accommodations.model';
import { FiltersType } from '../../models/filters-type.model';
import { SearchPanel } from '../../shared/components/search-panel/search-panel';
import { AccommodationsList } from '../../shared/components/accommodations-list/accommodations-list';
import { FilterSystem } from '../../shared/components/filter-system/filter-system';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
import { SortingSystem } from '../../shared/components/sorting-system/sorting-system';
import { FavoritesService } from '../../core/services/favorites.service';
import { SnackbarService } from '../../core/services/snackbar.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MobileFilterSystem } from '../../shared/components/mobile-dialogs/mobile-filter-system/mobile-filter-system';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchPanel, AccommodationsList, FilterSystem, SortingSystem],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  private accommodationService = inject(AccommodationsService);
  private favoritesService = inject(FavoritesService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);
  private filtersChanged$ = new Subject<Partial<FiltersType>>();
  private accommodationsRequestId = 0;

  accItems = signal<Accommodation[]>([]);
  hasSearched = signal(false);
  totalItems = signal(0);
  totalPages = signal(0);
  currentPage = signal(1);
  pageSize = signal(20);
  isMobile = signal(false);

  errorMessage = signal('');
  isLoading = signal(false);
  noResults = signal(false);

  hasMore = computed(() => this.currentPage() < this.totalPages());
  activeFilters = signal<Partial<FiltersType>>({});
  selectedSort = signal<'priceAsc' | 'priceDesc' | 'ratingDesc'>('priceAsc');

  sortOptions = [
    { label: 'Price (lowest first)', value: 'priceAsc' },
    { label: 'Price (highest first)', value: 'priceDesc' },
    { label: 'Rating (high to low)', value: 'ratingDesc' },
  ];

  selectSortMode(mode: string) {
    if (mode !== 'priceAsc' && mode !== 'priceDesc' && mode !== 'ratingDesc') {
      return;
    }

    this.selectedSort.set(mode);
    this.currentPage.set(1);
    this.updateQueryParams();
    this.loadAccommodations(true);
  }

  isFavorite = (accommodationId: number): boolean => {
    return this.favoritesService.isFavorite(accommodationId);
  };

  toggleFavorite(accommodationId: number) {
    if (this.favoritesService.isFavorite(accommodationId)) {
      this.favoritesService.removeFavorite(accommodationId).subscribe({
        next: () => {
          this.snackbarService.success('Removed from favorites');
        },
        error: () => {
          this.snackbarService.error('Unable to remove favorite');
        },
      });

      return;
    }

    this.favoritesService.addFavorite(accommodationId).subscribe({
      next: () => {
        this.snackbarService.success('Added to favorites');
      },
      error: () => {
        this.snackbarService.error('Unable to add favorite');
      },
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 300) {
      this.loadNextPage();
    }
  }

  private buildFilters(): FiltersType {
    return {
      ...this.activeFilters(),
      sort: this.selectedSort(),
      page: this.currentPage(),
      pageSize: this.pageSize(),
    };
  }

  applyFilters(filters: Partial<FiltersType>) {
    this.activeFilters.update((current) => ({
      ...current,
      ...filters,
    }));

    this.currentPage.set(1);
    this.updateQueryParams();
    this.loadAccommodations(true);
  }

  onFilterChanged(filters: Partial<FiltersType>) {
    this.filtersChanged$.next(filters);
    this.hasSearched.set(true);
  }

  private getNumberParam(name: string, minValue?: number): number | undefined {
    const value = this.route.snapshot.queryParamMap.get(name);

    if (value === null || value.trim() === '') {
      return undefined;
    }

    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue)) {
      return undefined;
    }

    if (minValue !== undefined && parsedValue < minValue) {
      return undefined;
    }

    return parsedValue;
  }

  private buildQueryParams() {
    const filters = this.activeFilters();

    return {
      destination: filters.destination || null,
      amenities: filters.amenities?.length ? filters.amenities.join(',') : null,
      minPrice: filters.minPrice ?? null,
      maxPrice: filters.maxPrice ?? null,
      guests: filters.guests ?? null,
      checkIn: filters.checkIn || null,
      checkOut: filters.checkOut || null,
      sort: this.selectedSort() || null,
    };
  }

  updateQueryParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.buildQueryParams(),
    });
  }

  private loadFiltersFromQueryParams() {
    const params = this.route.snapshot.queryParamMap;
    const amenities = params.get('amenities');
    const sort = params.get('sort');

    if (sort === 'priceAsc' || sort === 'priceDesc' || sort === 'ratingDesc') {
      this.selectedSort.set(sort);
    }

    this.activeFilters.set({
      destination: params.get('destination') || undefined,
      guests: this.getNumberParam('guests', 1),
      minPrice: this.getNumberParam('minPrice', 0),
      maxPrice: this.getNumberParam('maxPrice', 0),
      checkIn: params.get('checkIn') || undefined,
      checkOut: params.get('checkOut') || undefined,
      amenities: amenities
        ? amenities
            .split(',')
            .map((amenity) => amenity.trim())
            .filter(Boolean)
        : undefined,
    });
  }

  loadAccommodations(reset = false) {
    if (this.isLoading() && !reset) return;

    if (reset) {
      this.currentPage.set(1);
      this.accItems.set([]);
    }

    const requestId = ++this.accommodationsRequestId;
    const filters = this.buildFilters();

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.noResults.set(false);

    this.accommodationService.getAccommodations(filters).subscribe({
      next: (response) => {
        if (requestId !== this.accommodationsRequestId) {
          return;
        }
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPages.set(response.totalPages ?? 0);

        if (reset) {
          this.accItems.set(response.items);
        } else {
          this.accItems.update((items) => [...items, ...response.items]);
        }

        this.isLoading.set(false);
        this.noResults.set(response.totalItems === 0);
      },
      error: () => {
        if (requestId !== this.accommodationsRequestId) {
          return;
        }
        this.errorMessage.set('Unable to load accommodations');
        this.isLoading.set(false);
      },
    });
  }

  loadNextPage() {
    if (this.isLoading() || !this.hasMore()) return;

    this.currentPage.update((page) => page + 1);

    this.loadAccommodations();
  }

  getDestinationName() {
    const destinationName = this.activeFilters().destination;

    return destinationName
      ? destinationName
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';
  }

  private hasSearchParams(): boolean {
    const filters = this.activeFilters();

    return Boolean(
      filters.destination ||
      filters.guests ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.checkIn ||
      filters.checkOut ||
      filters.amenities?.length,
    );
  }

  openFilterSystem() {
    const dialogRef = this.dialog.open(MobileFilterSystem, {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      panelClass: 'mobile-filter-system-dialog',
      data: {
        filters: this.activeFilters(),
        accItems: this.accItems(),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((filters: Partial<FiltersType> | undefined) => {
        if (!filters) {
          return;
        }

        this.applyFilters(filters);
      });
  }

  ngOnInit(): void {
    this.loadFiltersFromQueryParams();
    this.hasSearched.set(this.hasSearchParams());

    this.filtersChanged$
      .pipe(debounceTime(500), takeUntilDestroyed(this.destroyRef))
      .subscribe((filters) => this.applyFilters(filters));

    this.loadAccommodations();
  }
}
