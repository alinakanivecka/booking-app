import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingSystem } from './sorting-system';

describe('SortingSystem', () => {
  let component: SortingSystem;
  let fixture: ComponentFixture<SortingSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortingSystem],
    }).compileComponents();

    fixture = TestBed.createComponent(SortingSystem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
