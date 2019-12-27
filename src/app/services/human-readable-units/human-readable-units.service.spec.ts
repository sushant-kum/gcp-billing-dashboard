import { TestBed } from '@angular/core/testing';

import { HumanReadableUnitsService } from './human-readable-units.service';

describe('HumanReadableUnitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HumanReadableUnitsService = TestBed.get(HumanReadableUnitsService);
    expect(service).toBeTruthy();
  });
});
