import { TestBed } from '@angular/core/testing';

import { TunerService } from './tuner.service';

describe('TunerServiceService', () => {
  let service: TunerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TunerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
