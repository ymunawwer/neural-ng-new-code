import { TestBed, inject } from '@angular/core/testing';

import { NodeapisService } from './nodeapis.service';

describe('NodeapisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NodeapisService]
    });
  });

  it('should be created', inject([NodeapisService], (service: NodeapisService) => {
    expect(service).toBeTruthy();
  }));
});
