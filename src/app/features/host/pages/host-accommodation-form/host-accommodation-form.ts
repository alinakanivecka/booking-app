import { Component, DestroyRef, inject, signal } from '@angular/core';
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
  private destroyRef = inject(DestroyRef);

  selectedFiles = signal<File[]>([]);
  previewUrls = signal<string[]>([]);
  createdAccommodationId = signal<number | null>(null);

  isLoading = signal(false);
  errorMessage = signal('');
  imageError = signal('');
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

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    this.imageError.set('');

    if (files.length === 0) {
      this.clearSelectedImages();
      this.imageError.set('Please select at least one image.');
      return;
    }

    const invalidFile = files.find((file) => !file.type.startsWith('image/'));

    if (invalidFile) {
      this.clearSelectedImages();
      input.value = '';
      this.imageError.set('Only image files are allowed.');
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    const tooLargeFile = files.find((file) => file.size > maxFileSize);

    if (tooLargeFile) {
      this.clearSelectedImages();
      input.value = '';
      this.imageError.set('Each image must be smaller than 5 MB.');
      return;
    }

    const previewFiles = files.map((file) => URL.createObjectURL(file));

    this.selectedFiles.update((current) => [...current, ...files]);
    this.previewUrls.update((current) => [...current, ...previewFiles]);
    input.value = '';
  }

  removeImage(index: number) {
    this.selectedFiles.update((files) => files.filter((_, i) => i !== index));

    this.previewUrls.update((urls) => {
      URL.revokeObjectURL(urls[index]);
      return urls.filter((_, i) => i !== index);
    });
  }

  submitForm() {
    if (this.hostAccommodationForm.invalid) {
      this.hostAccommodationForm.markAllAsTouched();
      return;
    }

    const existingCreatedId = this.createdAccommodationId();

    if (!this.editMode() && existingCreatedId && this.selectedFiles().length > 0) {
      this.uploadImages(existingCreatedId);
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

      if (!id) {
        this.isLoading.set(false);
        this.errorMessage.set('');
        return;
      }

      return this.hostService.editHostAccommodation(id, createPayload).subscribe({
        next: () => {
          if (this.selectedFiles().length > 0) {
            this.uploadImages(id);
            return;
          }
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
      next: (response) => {
        const id = response.id;
        this.createdAccommodationId.set(id);

        if (this.selectedFiles().length > 0) {
          this.uploadImages(id);
          return;
        }

        this.router.navigate(['/host/accommodations']);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Something went wrong');
        this.isLoading.set(false);
      },
    });
  }

  uploadImages(id: number) {
    const files = this.selectedFiles();

    if (this.selectedFiles().length === 0) {
      return;
    }

    this.isLoading.set(true);
    this.imageError.set('');

    this.hostService.uploadHostAccommodationImages(id, files).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/host/accommodations']);
      },
      error: (error) => {
        this.isLoading.set(false);

        const filesError = error.error?.errors?.files?.[0];
        this.imageError.set(filesError || `Upload failed. Status: ${error.status}`);
      },
    });
  }

  loadAccommodation(id: number) {
    this.isLoading.set(true);
    this.errorMessage.set('');

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
    route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));

      if (id) {
        this.accommodationId.set(id);
        this.editMode.set(true);
        this.loadAccommodation(id);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.previewUrls().forEach((url) => URL.revokeObjectURL(url));
    });
  }

  private clearSelectedImages() {
    this.previewUrls().forEach((url) => URL.revokeObjectURL(url));
    this.selectedFiles.set([]);
    this.previewUrls.set([]);
  }
}
