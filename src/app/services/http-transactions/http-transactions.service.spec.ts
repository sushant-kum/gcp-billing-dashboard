import { TestBed } from '@angular/core/testing';

import { HttpTransactionsService } from './http-transactions.service';

describe('HttpTransactionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpTransactionsService = TestBed.get(HttpTransactionsService);
    expect(service).toBeTruthy();
  });
});
