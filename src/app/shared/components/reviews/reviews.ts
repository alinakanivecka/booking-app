import { Component, effect, inject, input, output, signal } from '@angular/core';
import { ReviewsService } from '../../../core/services/reviews.service';
import { Review } from '../../../models/reviews.model';
import { Accommodation } from '../../../models/accommodations.model';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reviews',
  imports: [DatePipe],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews {
  private reviewsService = inject(ReviewsService);
  authService = inject(AuthService);
  accommodation = input<Accommodation>();
  accommodationRating = input();
  reviewsCountChange = output<number>();
  currentUserReviewChange = output<boolean>();

  reviews = signal<Review[]>([]);
  isLoading = signal(false);
  noResults = signal(false);
  errorMessage = signal('');

  loadReviews(id: number) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.reviewsService.getAccommodationsReviews(id).subscribe({
      next: (response) => {
        const currentUser = this.authService.currentUser();

        this.currentUserReviewChange.emit(
          !!currentUser && response.some((review) => review.customerId === currentUser.id),
        );

        this.reviews.set(response);
        this.reviewsCountChange.emit(response.length);
        this.noResults.set(response.length === 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Something went wrong');
      },
    });
  }

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = Number(params.get('id'));

      this.loadReviews(id);
    });
  }
}
