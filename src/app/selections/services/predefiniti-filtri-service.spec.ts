import { TestBed } from '@angular/core/testing';

import { PredefinitiFiltriService } from './predefiniti-filtri-service';

describe('PredefinitiFiltriService', () => {
  let service: PredefinitiFiltriService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredefinitiFiltriService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
