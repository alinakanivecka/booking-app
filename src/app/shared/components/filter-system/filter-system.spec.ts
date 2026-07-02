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

    fixture.componentRef.setInput('accItems', []);
    fixture.componentRef.setInput('filters', {});

    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
