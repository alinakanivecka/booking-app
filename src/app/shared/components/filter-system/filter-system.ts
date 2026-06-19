import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { Accommodation } from '../../../models/accommodations.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FiltersType } from '../../../models/filters-type.model';
import { AccommodationsService } from '../../../core/services/accommodations.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-filter-system',
  imports: [MatSliderModule, ReactiveFormsModule],
  templateUrl: './filter-system.html',
  styleUrl: './filter-system.scss',
})
export class FilterSystem {
  private accommodationService = inject(AccommodationsService);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  accItems = input.required<Accommodation[]>();
  filters = input<Partial<FiltersType>>({});
  filterChanged = output<Partial<FiltersType>>();

  isShowAllAmenities = signal(false);

  filterForm = this.fb.group({
    minPrice: [0],
    maxPrice: [1000],
    amenities: [[] as string[]],
  });

  toggleShowAll() {
    this.isShowAllAmenities.set(!this.isShowAllAmenities());
  }

  toggleAmenity(amenity: string) {
    const amenitiesControl = this.filterForm.controls.amenities;
    const currentAmenities = amenitiesControl.value ?? [];

    if (currentAmenities?.includes(amenity)) {
      const newAmenities = currentAmenities.filter((a) => a !== amenity);
      amenitiesControl.setValue(newAmenities);
      return;
    }

    const newAmenities = [...currentAmenities, amenity];
    amenitiesControl.setValue(newAmenities);
  }

  availableAmenities = computed(() => {
    const allAmenities = this.accItems().flatMap((item) => item.amenities);

    return [...new Set(allAmenities)];
  });

  defaultAmenities = computed(() => {
    return this.availableAmenities().slice(0, 6);
  });

  extraAmenities = computed(() => {
    return this.availableAmenities().slice(6);
  });

  replaceAmenity(ammenity: string): string {
    return this.accommodationService.replaceAmenity(ammenity);
  }

  constructor() {
    effect(() => {
      const filters = this.filters();

      this.filterForm.patchValue(
        {
          minPrice: filters.minPrice ?? 0,
          maxPrice: filters.maxPrice ?? 1000,
          amenities: filters.amenities ?? [],
        },
        { emitEvent: false },
      );
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.filterChanged.emit({
        minPrice: value.minPrice ?? undefined,
        maxPrice: value.maxPrice ?? undefined,
        amenities: value.amenities ?? undefined,
      });
    });
  }
}
