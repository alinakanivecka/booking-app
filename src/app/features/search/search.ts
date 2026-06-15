import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';

import { AccommodationsService } from '../../core/services/accommodations.service';
import { Items } from '../../models/accommodations.model';
import { FiltersType } from '../../models/filters-type.model';
import { SearchPanel } from '../../shared/components/search-panel/search-panel';
import { AccommodationsList } from '../../shared/components/accommodations-list/accommodations-list';
import { FilterSystem } from '../../shared/components/filter-system/filter-system';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchPanel, AccommodationsList, FilterSystem],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  private accommodationService = inject(AccommodationsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private filtersChanged$ = new Subject<Partial<FiltersType>>();

  accItems = signal<Items[]>([]);
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = signal(20);
  hasMore = computed(() => this.accItems().length < this.totalItems());
  activeFilters = signal<Partial<FiltersType>>({});

  errorMessage = signal('');
  isLoading = signal(false);
  noResults = signal(false);

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
      city: filters.city || null,
      country: filters.country || null,
      amenities: filters.amenities?.length ? filters.amenities.join(',') : null,
      minPrice: filters.minPrice ?? null,
      maxPrice: filters.maxPrice ?? null,
      guests: filters.guests ?? null,
      checkIn: filters.checkIn || null,
      checkOut: filters.checkOut || null,
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

    this.activeFilters.set({
      city: params.get('city') || undefined,
      country: params.get('country') || undefined,
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
    this.loadAccommodations();
  }

  getDestinationName() {
    const cityName = this.activeFilters().city;

    return cityName
      ? cityName
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
