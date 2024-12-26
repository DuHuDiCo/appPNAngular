import { TestBed } from '@angular/core/testing';

import { PagoClienteService } from '../Pago-clientes/pago-cliente.service';

describe('PagoClienteService', () => {
  let service: PagoClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagoClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
