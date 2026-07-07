import { Component, computed, inject, signal } from '@angular/core';
import { HostService } from '../../../../core/services/host.service';
import { HostFiltersType } from '../../../../models/filters-type.model';
import { HostBooking } from '../../../../models/host-bookings.model';
import { HostAccommodation } from '../../../../models/host-accommodations.model';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { getApiErrorMessage } from '../../../../shared/utils/http-error-message';

type HostBookingsFilterUpdate = {
  status?: string;
  accommodationId?: number | null;
};

@Component({
  selector: 'app-host-bookings',
  imports: [Dropdown],
  templateUrl: './host-bookings.html',
  styleUrl: './host-bookings.scss',
})
export class HostBookings {
  private hostService = inject(HostService);

  bookings = signal<HostBooking[]>([]);
  accommodations = signal<HostAccommodation[]>([]);
  selectedStatus = signal('');
  selectedAccommodationId = signal<number | null>(null);

  totalItems = signal(0);
  totalPages = signal(0);
  noResults = computed(() => !this.isBookingsLoading() && this.bookings().length === 0);
  currentPage = signal(1);
  pageSize = signal(20);

  isBookingsLoading = signal(false);
  isAccommodationsLoading = signal(false);
  isLoading = computed(() => this.isBookingsLoading() || this.isAccommodationsLoading());
  errorMessage = signal('');

  prevPage = computed(() => this.currentPage() > 1 && !this.isBookingsLoading());
  nextPage = computed(() => this.currentPage() < this.totalPages() && !this.isBookingsLoading());

  pageInfo = computed(() => {
    if (this.totalItems() === 0) {
      return 'No bookings';
    }

    return `Page ${this.currentPage()} of ${this.totalPages()}`;
  });

  buildFilters(): HostFiltersType {
    return {
      accommodationId: this.selectedAccommodationId() ?? undefined,
      status: this.selectedStatus() || undefined,
      page: this.currentPage(),
      pageSize: this.pageSize(),
    };
  }

  updateFilters(filters: HostBookingsFilterUpdate) {
    if (filters.status !== undefined) {
      this.selectedStatus.set(filters.status);
    }

    if (filters.accommodationId !== undefined) {
      this.selectedAccommodationId.set(filters.accommodationId);
    }

    this.currentPage.set(1);
    this.loadBookings();
  }

  loadBookings() {
    if (this.isBookingsLoading()) return;

    const filters = this.buildFilters();

    this.isBookingsLoading.set(true);
    this.errorMessage.set('');

    this.hostService.getHostBookings(filters).subscribe({
      next: (response) => {
        this.bookings.set(response.items);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPages.set(response.totalPages);
        this.currentPage.set(response.page);
        this.pageSize.set(response.pageSize);

        this.isBookingsLoading.set(false);
      },
      error: (error) => {
        this.isBookingsLoading.set(false);
        this.errorMessage.set(
          getApiErrorMessage(error, 'Unable to load bookings. Please try again'),
        );
      },
    });
  }

  loadAccommodations() {
    this.isAccommodationsLoading.set(true);
    this.errorMessage.set('');

    this.hostService.getHostAccommodations().subscribe({
      next: (response) => {
        this.accommodations.set(response);
        this.isAccommodationsLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          getApiErrorMessage(error, 'Unable to load accommodations. Please try again'),
        );
        this.isAccommodationsLoading.set(false);
      },
    });
  }

  goToPreviousPage() {
    if (!this.prevPage()) return;

    this.currentPage.update((page) => page - 1);
    this.loadBookings();
  }

  goToNextPage() {
    if (!this.nextPage()) return;

    this.currentPage.update((page) => page + 1);
    this.loadBookings();
  }

  statusOptions = [
    { label: 'All statuses', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  accommodationOptions = computed(() => [
    { label: 'All properties', value: null },
    ...this.accommodations().map((item) => ({
      label: item.name,
      value: item.id,
    })),
  ]);

  constructor() {
    this.loadBookings();
    this.loadAccommodations();
  }
}
