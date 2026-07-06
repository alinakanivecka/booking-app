import { Component, inject, signal } from '@angular/core';
import { HostAccommodation } from '../../../../models/host-accommodations.model';
import { HostService } from '../../../../core/services/host.service';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteAccommodationDialog } from '../../../../shared/components/dialogs/delete-accommodation-dialog/delete-accommodation-dialog';

@Component({
  selector: 'app-host-accommodations',
  imports: [RouterLink],
  templateUrl: './host-accommodations.html',
  styleUrl: './host-accommodations.scss',
})
export class HostAccommodations {
  private hostService = inject(HostService);
  private dialog = inject(MatDialog);
  accommodations = signal<HostAccommodation[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  selectedAccommodationId = signal<number | null>(null);

  constructor() {
    this.loadAccommodations();
  }

  openDeleteModal(id: number) {
    const dialogRef = this.dialog.open(DeleteAccommodationDialog, {
      data: {
        accommodationId: id,
      },
      width: 'min(100vw - 2rem, 28rem)',
      maxWidth: '28rem',
      panelClass: 'custom-modal-dialog',
    });

    dialogRef.afterClosed().subscribe((wasDeleted: boolean) => {
      if (!wasDeleted) {
        return;
      }

      this.accommodations.update((items) => items.filter((item) => item.id !== id));
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
