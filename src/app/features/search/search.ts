import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';

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
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private filtersChanged$ = new Subject<Partial<FiltersType>>();

  accItems = signal<Accommodation[]>([]);
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = signal(20);

  errorMessage = signal('');
  isLoading = signal(false);
  noResults = signal(false);

  hasMore = computed(() => this.accItems().length < this.totalItems());
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
        error: () => {
          this.errorMessage.set('Unable to remove favorite');
        },
      });

      return;
    }

    this.favoritesService.addFavorite(accommodationId).subscribe({
      error: () => {
        this.errorMessage.set('Unable to add favorite');
      },
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    const threshold = 300;

    if (scrollPosition >= pageHeight - threshold) {
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
  }

  private getNumberParam(name: string): number | undefined {
    const value = this.route.snapshot.queryParamMap.get(name);
    return value === null ? undefined : Number(value);
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
      page: this.currentPage() || null,
      pageSize: this.pageSize() || null,
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
    const page = this.getNumberParam('page');
    const pageSize = this.getNumberParam('pageSize');

    if (sort === 'priceAsc' || sort === 'priceDesc' || sort === 'ratingDesc') {
      this.selectedSort.set(sort);
    }

    if (page && page > 0) {
      this.currentPage.set(page);
    }

    if (pageSize && pageSize > 0) {
      this.pageSize.set(pageSize);
    }

    this.activeFilters.set({
      destination: params.get('destination') || undefined,
      guests: this.getNumberParam('guests'),
      minPrice: this.getNumberParam('minPrice'),
      maxPrice: this.getNumberParam('maxPrice'),
      checkIn: params.get('checkIn') || undefined,
      checkOut: params.get('checkOut') || undefined,
      amenities: amenities ? amenities.split(',').filter(Boolean) : undefined,
    });
  }

  loadAccommodations(reset = false) {
    if (this.isLoading()) return;

    if (reset) {
      this.currentPage.set(1);
      this.accItems.set([]);
    }

    const filters = this.buildFilters();

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.noResults.set(false);

    this.accommodationService.getAccommodations(filters).subscribe({
      next: (response) => {
        this.totalItems.set(response.totalItems ?? 0);

        if (reset) {
          this.accItems.set(response.items);
        } else {
          this.accItems.update((items) => [...items, ...response.items]);
        }

        this.isLoading.set(false);
        this.noResults.set(response.totalItems === 0);
      },
      error: () => {
        this.errorMessage.set('Unable to load accommodations');
        this.isLoading.set(false);
      },
    });
  }

  loadNextPage() {
    if (this.isLoading() || !this.hasMore()) return;

    this.currentPage.update((page) => page + 1);
    this.updateQueryParams();
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

  ngOnInit(): void {
    this.loadFiltersFromQueryParams();

    this.filtersChanged$.pipe(debounceTime(500)).subscribe((filters) => this.applyFilters(filters));

    this.loadAccommodations();
  }
}
