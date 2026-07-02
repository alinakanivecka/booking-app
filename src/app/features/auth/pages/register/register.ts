import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { getApiErrorMessage } from '../../../../shared/utils/http-error-message';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  private authService = inject(AuthService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  isLoading = signal(false);
  serverError = signal<string | null>(null);

  registerForm = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.required, Validators.email],
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(8)],
    }),
    name: this.formBuilder.control('', Validators.required),
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formValue = this.registerForm.getRawValue();
    const registerPayload = {
      email: formValue.email.trim().toLowerCase(),
      password: formValue.password,
      name: formValue.name.trim(),
    };

    this.isLoading.set(true);
    this.serverError.set(null);

    this.authService.register(registerPayload).subscribe({
      next: (response) => {
        this.authService.saveAuthData(response);
        this.router.navigate(['/search']);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.serverError.set(
          getApiErrorMessage(error, 'Unable to create account. Please try again.'),
        );
        this.isLoading.set(false);
      },
    });
  }

  get emailErrorMessage(): string | null {
    const email = this.registerForm.controls.email;

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
    const password = this.registerForm.controls.password;

    if (!password.touched) return null;

    if (password.hasError('required')) {
      return 'Password is required.';
    }

    if (password.hasError('minlength')) {
      return 'Password must be at least 8 characters.';
    }

    return null;
  }

  get nameErrorMessage(): string | null {
    const name = this.registerForm.controls.name;

    if (!name.touched) return null;

    if (name.hasError('required')) {
      return 'Name is required';
    }

    return null;
  }

  ngOnInit(): void {
    this.registerForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.serverError.set(null);
    });
  }
}
