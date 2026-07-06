import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HostService } from '../../../../core/services/host.service';
import { getApiErrorMessage } from '../../../../shared/utils/http-error-message';

type DialogData = {
  accommodationId: number;
};

@Component({
  selector: 'app-delete-accommodation-dialog',
  templateUrl: './delete-accommodation-dialog.html',
  styleUrl: './delete-accommodation-dialog.scss',
})
export class DeleteAccommodationDialog {
  private dialogRef = inject(MatDialogRef<DeleteAccommodationDialog>);
  private hostService = inject(HostService);
  private data = inject<DialogData>(MAT_DIALOG_DATA);

  isDeleting = signal(false);
  deleteErrorMessage = signal('');

  close() {
    this.dialogRef.close(false);
  }

  deleteAccommodation() {
    if (this.isDeleting()) {
      return;
    }

    this.isDeleting.set(true);
    this.deleteErrorMessage.set('');

    this.hostService.removeHostAccommodation(this.data.accommodationId).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isDeleting.set(false);
        this.deleteErrorMessage.set(
          getApiErrorMessage(error, 'Unable to delete accommodation. Please try again.'),
        );
      },
    });
  }
}
