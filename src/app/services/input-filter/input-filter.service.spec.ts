import { TestBed } from '@angular/core/testing';

import { InputFilterService } from './input-filter.service';

describe('InputFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InputFilterService = TestBed.get(InputFilterService);
    expect(service).toBeTruthy();
  });
});
