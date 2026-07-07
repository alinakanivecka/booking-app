import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { unsavedChangesGuard } from '../unsaved-changes-guard/unsaved-changes-guard';
import { HostAccommodationForm } from '../../../features/host/pages/host-accommodation-form/host-accommodation-form';

describe('unsavedChangesGuard', () => {
  const executeGuard: CanDeactivateFn<HostAccommodationForm> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => unsavedChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
