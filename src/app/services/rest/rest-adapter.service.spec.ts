import { TestBed, inject } from '@angular/core/testing';

import { RestAdapterService } from './rest-adapter.service';

describe('RestAdapterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestAdapterService]
    });
  });

  it('should be created', inject([RestAdapterService], (service: RestAdapterService) => {
    expect(service).toBeTruthy();
  }));
});
