import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosClientesSinAplicarComponent } from './pagos-clientes-sin-aplicar.component';

describe('PagosClientesSinAplicarComponent', () => {
  let component: PagosClientesSinAplicarComponent;
  let fixture: ComponentFixture<PagosClientesSinAplicarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagosClientesSinAplicarComponent]
    });
    fixture = TestBed.createComponent(PagosClientesSinAplicarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
