import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';

import { AccommodationsService } from '../../core/services/accommodations.service';
import { Items } from '../../models/accommodations.model';
import { FiltersType } from '../../models/filters-type.model';
import { SearchPanel } from '../../shared/components/search-panel/search-panel';
import { AccommodationsList } from '../../shared/components/accommodations-list/accommodations-list';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SearchPanel, AccommodationsList],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  private accommodationService = inject(AccommodationsService);

  accItems = signal<Items[]>([]);
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = signal(20);
  hasMore = computed(() => this.accItems().length < this.totalItems());
  activeFilters = signal<Partial<FiltersType>>({});

  errorMessage = signal('');
  isLoading = signal(false);

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

  search(filters: Partial<FiltersType>) {
    this.activeFilters.set(filters);
    this.currentPage.set(1);
    this.loadAccommodations(true);
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

    this.accommodationService.getAccommodations(filters).subscribe({
      next: (response) => {
        this.totalItems.set(response.totalItems);

        if (reset) {
          this.accItems.set(response.items);
        } else {
          this.accItems.update((items) => [...items, ...response.items]);
        }

        this.isLoading.set(false);
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

  ngOnInit(): void {
    this.loadAccommodations();
  }
}
