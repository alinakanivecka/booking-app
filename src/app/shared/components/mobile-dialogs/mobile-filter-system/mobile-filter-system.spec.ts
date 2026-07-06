import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileFilterSystem } from './mobile-filter-system';

describe('MobileFilterSystem', () => {
  let component: MobileFilterSystem;
  let fixture: ComponentFixture<MobileFilterSystem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileFilterSystem],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileFilterSystem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
