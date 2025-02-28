import { TestBed } from '@angular/core/testing';

import { ConectorPagosService } from './conector-pagos.service';

describe('ConectorPagosService', () => {
  let service: ConectorPagosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConectorPagosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
