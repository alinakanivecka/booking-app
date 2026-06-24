import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HostService } from '../../../../core/services/host.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateHostAccommodationPayload } from '../../../../models/host-accommodations.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccommodationsService } from '../../../../core/services/accommodations.service';

@Component({
  selector: 'app-host-accommodation-form',
  imports: [ReactiveFormsModule],
  templateUrl: './host-accommodation-form.html',
  styleUrl: './host-accommodation-form.scss',
})
export class HostAccommodationForm {
  private hostService = inject(HostService);
  private accommodationService = inject(AccommodationsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal('');
  editMode = signal(false);
  accommodationId = signal<number | null>(null);

  hostAccommodationForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    maxGuests: [1, [Validators.required, Validators.min(1)]],
    pricePerNight: [1, [Validators.required, Validators.min(1)]],
    amenities: ['', Validators.required],
  });

  submitForm() {
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

    if (this.editMode()) {
      const id = this.accommodationId();

      if (!id) return;

      return this.hostService.editHostAccommodation(id, createPayload).subscribe({
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

    return this.hostService.createHostAccommodation(createPayload).subscribe({
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

  loadAccommodation(id: number) {
    this.isLoading.set(true);
    this.errorMessage.set('')

    this.accommodationService.getAccommodationById(id).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.hostAccommodationForm.patchValue({
          ...response,
          amenities: response.amenities.join(', '),
        });
        this.hostAccommodationForm.markAsPristine();
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Unable to load accommodation');
      },
    });
  }

  constructor(route: ActivatedRoute) {
    route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = Number(params.get('id'));

      if (id) {
        this.accommodationId.set(id);
        this.editMode.set(true);
        this.loadAccommodation(id);
      }
    });
  }
}
