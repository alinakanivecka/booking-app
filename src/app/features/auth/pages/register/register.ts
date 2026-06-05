import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';

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

    this.isLoading.set(true);
    this.serverError.set(null);

    this.authService.register(formValue).subscribe({
      next: (response) => {
        console.log('succses', response);
        this.authService.saveAuthData(response);
        this.router.navigate(['/search']);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.log('error:', error);
        this.serverError.set('This email is already registered.');
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
    this.registerForm.valueChanges.subscribe(() => {
      this.serverError.set(null);
    });
  }
}
