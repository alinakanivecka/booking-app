import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestControl } from './guest-control';

describe('GuestControl', () => {
  let component: GuestControl;
  let fixture: ComponentFixture<GuestControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestControl],
    }).compileComponents();

    fixture = TestBed.createComponent(GuestControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
