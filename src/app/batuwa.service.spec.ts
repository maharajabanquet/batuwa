import { TestBed } from '@angular/core/testing';

import { BatuwaService } from './batuwa.service';

describe('BatuwaService', () => {
  let service: BatuwaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatuwaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
