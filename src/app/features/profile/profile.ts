import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { getApiErrorMessage } from '../../shared/utils/http-error-message';

@Component({
  selector: 'app-profile',
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  becomeHost() {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.becomeHost().subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/host/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          getApiErrorMessage(error, 'Unable to become a host. Please try again.'),
        );
      },
    });
  }
}
