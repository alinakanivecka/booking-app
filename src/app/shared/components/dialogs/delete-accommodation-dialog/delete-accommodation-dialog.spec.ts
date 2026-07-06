import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccommodationDialog } from './delete-accommodation-dialog';

describe('DeleteAccommodationDialog', () => {
  let component: DeleteAccommodationDialog;
  let fixture: ComponentFixture<DeleteAccommodationDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAccommodationDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAccommodationDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
