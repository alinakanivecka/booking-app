import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileUserMenu } from './mobile-user-menu';

describe('MobileUserMenu', () => {
  let component: MobileUserMenu;
  let fixture: ComponentFixture<MobileUserMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileUserMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileUserMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
