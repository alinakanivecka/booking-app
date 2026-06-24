import { Component, inject, signal } from '@angular/core';
import { HostAccommodation } from '../../../../models/host-accommodations.model';
import { HostService } from '../../../../core/services/host.service';
import { RouterLink } from "@angular/router";

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
  errorMessage = signal('');

  constructor() {
    this.loadAccommodations();
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
