import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReviewsService } from '../../../../core/services/reviews.service';
import { CreateReviewPayload } from '../../../../models/reviews.model';
import { getApiErrorMessage } from '../../../utils/http-error-message';

type DialogData = {
  accommodationId: number;
};

@Component({
  selector: 'app-leave-review-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './leave-review-dialog.html',
  styleUrl: './leave-review-dialog.scss',
})
export class LeaveReviewDialog {
  private dialogRef = inject(MatDialogRef<LeaveReviewDialog>);
  private reviewsService = inject(ReviewsService);
  private data = inject<DialogData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal('');

  reviewForm = this.fb.nonNullable.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.required],
  });

  close() {
    this.dialogRef.close(false);
  }

  submitReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const value = this.reviewForm.getRawValue();

    const payload: CreateReviewPayload = {
      accommodationId: this.data.accommodationId,
      rating: value.rating,
      comment: value.comment,
    };

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.reviewsService.createReview(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          getApiErrorMessage(error, 'Unable to submit review. Please try again.'),
        );
      },
    });
  }
}
