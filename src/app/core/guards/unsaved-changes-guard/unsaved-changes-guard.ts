import { CanDeactivateFn } from '@angular/router';
import { HostAccommodationForm } from '../../../features/host/pages/host-accommodation-form/host-accommodation-form';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LeavePageDialog } from '../../../shared/components/dialogs/leave-page-dialog/leave-page-dialog';

export const unsavedChangesGuard: CanDeactivateFn<HostAccommodationForm> = (component) => {
  const dialog = inject(MatDialog);

  if (component.canLeavePage()) {
    return true;
  }

  const dialogRef = dialog.open(LeavePageDialog, {
    width: 'min(100vw - 2rem, 34rem)',
    maxWidth: '34rem',
    panelClass: 'custom-modal-dialog',
    disableClose: true,
  });

  return dialogRef.afterClosed();
};
