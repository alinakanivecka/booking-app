import { Component, computed, inject, signal } from '@angular/core';
import { HostService } from '../../../../core/services/host.service';
import { HostFiltersType } from '../../../../models/filters-type.model';
import { HostBooking } from '../../../../models/host-bookings.model';
import { HostAccommodation } from '../../../../models/host-accommodations.model';
import { Dropdown } from "../../../../shared/components/dropdown/dropdown";

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
  noResults = computed(() => !this.isLoading() && this.bookings().length === 0);
  page = signal(0);
  pageSize = signal(20);
  isLoading = signal(false);
  errorMessage = signal('');

  buildFilters(): HostFiltersType {
    return {
      accommodationId: this.selectedAccommodationId() ?? undefined,
      status: this.selectedStatus() || undefined,
      page: this.page(),
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

    this.page.set(0);
    this.loadBookings();
  }

  loadBookings() {
    const filters = this.buildFilters();

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.hostService.getHostBookings(filters).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.bookings.set(response.items);
        this.totalItems.set(response.totalItems ?? 0);
        this.totalPages.set(response.totalPages);
        this.page.set(response.page);
        this.pageSize.set(response.pageSize);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set('Unable to load bookings');
      },
    });
  }

  loadAccommodations() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.hostService.getHostAccommodations().subscribe({
      next: (response) => {
        this.accommodations.set(response);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Something went wrong');
        this.isLoading.set(false);
      },
    });
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
