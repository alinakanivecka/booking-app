import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

declare const google: any;

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

  isLoading = signal(false);
  serverError = signal<string | null>(null);

  loginForm = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formValue = this.loginForm.getRawValue();

    this.isLoading.set(true);
    this.serverError.set(null);

    this.authService.login(formValue).subscribe({
      next: (response) => {
        console.log('succses', response);
        this.authService.saveAuthData(response);
        this.router.navigate(['/search']);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.log('error:', error);
        this.serverError.set('Invalid email or password.');
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

    return null;
  }

  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,

      callback: (googleResponse: any) => {
        const identityToken = googleResponse.credential;

        this.isLoading.set(true);
        this.serverError.set(null);

        this.authService.loginWithGoogle(identityToken).subscribe({
          next: (authResponse) => {
            this.authService.saveAuthData(authResponse);
            this.router.navigate(['/search']);
            this.isLoading.set(false);
          },
          error: (error) => {
            this.router.navigate(['/login']);
            this.serverError.set('Google login failed. Please try again.');
            this.isLoading.set(false);
          },
        });
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-button'), {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      locale: 'en',
    });

    google.accounts.id.prompt();
  }

  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.serverError.set(null);
    });
  }
}
