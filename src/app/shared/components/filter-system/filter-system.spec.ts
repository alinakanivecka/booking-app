import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterSystem } from './filter-system';

describe('FilterSystem', () => {
  let component: FilterSystem;
  let fixture: ComponentFixture<FilterSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterSystem],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterSystem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
