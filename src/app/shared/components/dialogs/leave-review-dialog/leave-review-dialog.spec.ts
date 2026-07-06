import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveReviewDialog } from './leave-review-dialog';

describe('LeaveReviewDialog', () => {
  let component: LeaveReviewDialog;
  let fixture: ComponentFixture<LeaveReviewDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveReviewDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveReviewDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
