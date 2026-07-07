import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { A11yModule } from "@angular/cdk/a11y";

@Component({
  selector: 'app-leave-page-dialog',
  imports: [A11yModule],
  templateUrl: './leave-page-dialog.html',
  styleUrl: './leave-page-dialog.scss',
})
export class LeavePageDialog {
  private dialogRef = inject(MatDialogRef<LeavePageDialog>);

  leave() {
    this.dialogRef.close(true);
  }

  stay() {
    this.dialogRef.close(false);
  }
}
