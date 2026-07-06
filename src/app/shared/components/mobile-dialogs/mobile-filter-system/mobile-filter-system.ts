import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Accommodation } from '../../../../models/accommodations.model';
import { FiltersType } from '../../../../models/filters-type.model';
import { FilterSystem } from '../../filter-system/filter-system';

interface MobileFilterSystemData {
  accItems: Accommodation[];
  filters: Partial<FiltersType>;
}

@Component({
  selector: 'app-mobile-filter-system',
  imports: [FilterSystem],
  templateUrl: './mobile-filter-system.html',
  styleUrl: './mobile-filter-system.scss',
})
export class MobileFilterSystem {
  private dialogRef = inject(MatDialogRef<MobileFilterSystem>);
  data = inject<MobileFilterSystemData>(MAT_DIALOG_DATA);
  selectedFilters: Partial<FiltersType> = this.data.filters;

  close() {
    this.dialogRef.close();
  }

  setFilters(filters: Partial<FiltersType>) {
    this.selectedFilters = filters;
  }

  applyFilters() {
    this.dialogRef.close(this.selectedFilters);
  }
}
