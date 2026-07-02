import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccommodationsList } from './accommodations-list';

describe('AccommodationsList', () => {
  let component: AccommodationsList;
  let fixture: ComponentFixture<AccommodationsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccommodationsList],
    }).compileComponents();

    fixture = TestBed.createComponent(AccommodationsList);

    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('errorMessage', '');
    fixture.componentRef.setInput('accItems', []);
    fixture.componentRef.setInput('noResults', false);

    component = fixture.componentInstance;
    fixture.detectChanges();

    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
