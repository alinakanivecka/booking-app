import { AfterViewInit, Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { GoogleAccountsApi } from '../../models/google-accounts.model';
import { getApiErrorMessage } from '../../../../shared/utils/http-error-message';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements AfterViewInit {
  private authService = inject(AuthService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  serverError = signal<string | null>(null);

  loginForm = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValue = this.loginForm.getRawValue();
    const loginPayload = {
      email: formValue.email.trim().toLowerCase(),
      password: formValue.password,
    };

    this.isLoading.set(true);
    this.serverError.set(null);

    this.authService.login(loginPayload).subscribe({
      next: (response) => {
        this.authService.saveAuthData(response);
        this.router.navigate(['/search']);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.serverError.set(
          error.status === 400 || error.status === 401
            ? 'Invalid email or password.'
            : getApiErrorMessage(error),
        );
        this.isLoading.set(false);
      },
    });
  }

  get emailErrorMessage(): string | null {
    const email = this.loginForm.controls.email;

    if (!email.touched) return null;

    if (email.hasError('required')) {
      return 'Email is required.';
    }

    if (email.hasError('email')) {
      return 'Make sure the email address you entered is correct.';
    }

    return null;
  }

  get passwordErrorMessage(): string | null {
    const password = this.loginForm.controls.password;

    if (!password.touched) return null;

    if (password.hasError('required')) {
      return 'Password is required.';
    }

    if (password.hasError('minlength')) {
      return 'Password must be at least 8 characters.';
    }

    return null;
  }

  ngAfterViewInit() {
    const googleApi = (globalThis as typeof globalThis & { google?: GoogleAccountsApi }).google;

    if (!googleApi?.accounts?.id) {
      this.serverError.set('Google login is temporarily unavailable.');
      return;
    }

    googleApi.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (googleResponse) => {
        const identityToken = googleResponse.credential;

        this.isLoading.set(true);
        this.serverError.set(null);

        this.authService.loginWithGoogle(identityToken).subscribe({
          next: (authResponse) => {
            this.authService.saveAuthData(authResponse);
            this.router.navigate(['/search']);
            this.isLoading.set(false);
          },
          error: () => {
            this.router.navigate(['/login']);
            this.serverError.set('Google login failed. Please try again.');
            this.isLoading.set(false);
          },
        });
      },
    });

    googleApi.accounts.id.renderButton(document.getElementById('google-button'), {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      locale: 'en',
    });

    googleApi.accounts.id.prompt();
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.serverError.set(null);
    });
  }
}
