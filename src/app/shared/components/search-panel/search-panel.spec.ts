import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPanel } from './search-panel';
import { provideNativeDateAdapter } from '@angular/material/core';

describe('SearchPanel', () => {
  let component: SearchPanel;
  let fixture: ComponentFixture<SearchPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPanel],
      providers: [provideNativeDateAdapter()],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPanel);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
