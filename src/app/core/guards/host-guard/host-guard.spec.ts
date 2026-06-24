import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostGuard } from './host-guard';

describe('HostGuard', () => {
  let component: HostGuard;
  let fixture: ComponentFixture<HostGuard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostGuard],
    }).compileComponents();

    fixture = TestBed.createComponent(HostGuard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
