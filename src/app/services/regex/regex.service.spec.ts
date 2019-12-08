import { TestBed } from '@angular/core/testing';

import { RegexService } from './regex.service';

describe('RegexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegexService = TestBed.get(RegexService);
    expect(service).toBeTruthy();
  });
});
