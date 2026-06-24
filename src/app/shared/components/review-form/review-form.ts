import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewsService } from '../../../core/services/reviews.service';
import { CreateReviewPayload } from '../../../models/reviews.model';

@Component({
  selector: 'app-review-form',
  imports: [ReactiveFormsModule],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss',
})
export class ReviewForm {
  private reviewsService = inject(ReviewsService);
  fb = inject(FormBuilder);

  accommodationId = input<number>();
  reviewCreated = output();
  close = output();

  isLoading = signal(false);
  errorMessage = signal('');

  reviewForm = this.fb.nonNullable.group({
    rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
    comment: ['', Validators.required],
  });

  submitReview() {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const value = this.reviewForm.getRawValue();
    const id = this.accommodationId();

    const reviewPayload: CreateReviewPayload = {
      accommodationId: id!,
      rating: value.rating,
      comment: value.comment,
    };

    this.isLoading.set(true);

    this.reviewsService.createReview(reviewPayload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.reviewCreated.emit();
        this.closeModal();
      },
      error: (error) => {
        this.isLoading.set(false);
        if (error.status === 400) {
          this.errorMessage.set('You already reviewed this accommodation');
          return;
        }
        this.errorMessage.set('Something went wrong. Please try again.');
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
