import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePageDialog } from './leave-page-dialog';

describe('LeavePageDialog', () => {
  let component: LeavePageDialog;
  let fixture: ComponentFixture<LeavePageDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavePageDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LeavePageDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
