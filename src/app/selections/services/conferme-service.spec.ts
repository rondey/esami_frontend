import { TestBed } from '@angular/core/testing';

import { ConfermeService } from './conferme-service';

describe('ConfermeService', () => {
  let service: ConfermeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfermeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
