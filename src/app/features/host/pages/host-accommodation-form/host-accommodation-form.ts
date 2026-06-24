import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HostService } from '../../../../core/services/host.service';
import { Router } from '@angular/router';
import { CreateHostAccommodationPayload } from '../../../../models/host-accommodations.model';

@Component({
  selector: 'app-host-accommodation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './host-accommodation-form.html',
  styleUrl: './host-accommodation-form.scss',
})
export class HostAccommodationForm {
  private hostService = inject(HostService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');

  hostAccommodationForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    maxGuests: [1, [Validators.required, Validators.min(1)]],
    pricePerNight: [1, [Validators.required, Validators.min(1)]],
    amenities: ['', Validators.required],
  });

  addNewAccommodation() {
    if (this.hostAccommodationForm.invalid) {
      this.hostAccommodationForm.markAllAsTouched();
      return;
    }

    const formValue = this.hostAccommodationForm.getRawValue();
    const createPayload: CreateHostAccommodationPayload = {
      ...formValue,
      amenities: formValue.amenities
        .split(',')
        .map((amenity) => amenity.trim())
        .filter((amenity) => amenity.length > 0),
    };

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.hostService.createHostAccommodation(createPayload).subscribe({
      next: () => {
        this.router.navigate(['/host/accommodations']);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Something went wrong');
        this.isLoading.set(false);
      },
    });
  }
}
