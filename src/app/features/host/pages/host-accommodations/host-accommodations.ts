import { Component, inject, signal } from '@angular/core';
import { HostAccommodation } from '../../../../models/host-accommodations.model';
import { HostService } from '../../../../core/services/host.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-host-accommodations',
  imports: [RouterLink],
  templateUrl: './host-accommodations.html',
  styleUrl: './host-accommodations.scss',
})
export class HostAccommodations {
  private hostService = inject(HostService);
  accommodations = signal<HostAccommodation[]>([]);
  isLoading = signal(false);
  isDeleting = signal(false);
  errorMessage = signal('');
  deleteErrorMessage = signal('');
  isDeleteModalOpen = signal(false);
  selectedAccommodationId = signal<number | null>(null);

  constructor() {
    this.loadAccommodations();
  }

  openDeleteModal(id: number) {
    this.deleteErrorMessage.set('');
    this.isDeleteModalOpen.set(true);
    this.selectedAccommodationId.set(id);
  }

  closeModal() {
    this.isDeleteModalOpen.set(false);
    this.selectedAccommodationId.set(null);
  }

  deleteAccommodation() {
    const id = this.selectedAccommodationId();

    if (id === null) return;

    this.isDeleting.set(true);
    this.deleteErrorMessage.set('');

    this.hostService.removeHostAccommodation(id).subscribe({
      next: () => {
        this.accommodations.update((items) => items.filter((item) => item.id !== id));
        this.isDeleting.set(false);
        this.closeModal();
      },
      error: () => {
        this.isDeleting.set(false);
        this.deleteErrorMessage.set('Unable to delete accommodation');
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
}
