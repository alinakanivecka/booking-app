import { Component, computed, effect, inject, input, output } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { Item } from '../../../models/accommodations.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FiltersType } from '../../../models/filters-type.model';
import { AccommodationsService } from '../../../core/services/accommodations.service';

@Component({
  selector: 'app-filter-system',
  imports: [MatSliderModule, ReactiveFormsModule],
  templateUrl: './filter-system.html',
  styleUrl: './filter-system.scss',
})
export class FilterSystem {
  private accommodationService = inject(AccommodationsService);
  private fb = inject(FormBuilder);

  accItems = input.required<Item[]>();
  filters = input<Partial<FiltersType>>({});
  filterChanged = output<Partial<FiltersType>>();

  filterForm = this.fb.group({
    minPrice: [0],
    maxPrice: [1000],
    amenities: [[] as string[]],
  });

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

  ngOnInit() {
    this.filterForm.valueChanges.subscribe((value) => {
      this.filterChanged.emit({
        minPrice: value.minPrice ?? undefined,
        maxPrice: value.maxPrice ?? undefined,
        amenities: value.amenities ?? undefined,
      });
    });
  }

  availableAmenities = computed(() => {
    const allAmenities = this.accItems().flatMap((item) => item.amenities);

    return [...new Set(allAmenities)];
  });

  replaceAmenity(ammenity: string): string {
    return this.accommodationService.replaceAmenity(ammenity);
  }
}
