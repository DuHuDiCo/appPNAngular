import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoClienteComponent } from './pago-cliente.component';

describe('PagoClienteComponent', () => {
  let component: PagoClienteComponent;
  let fixture: ComponentFixture<PagoClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagoClienteComponent]
    });
    fixture = TestBed.createComponent(PagoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
