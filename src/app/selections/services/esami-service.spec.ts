import { TestBed } from '@angular/core/testing';

import { EsamiService } from './esami-service';

describe('EsamiService', () => {
  let service: EsamiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EsamiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
