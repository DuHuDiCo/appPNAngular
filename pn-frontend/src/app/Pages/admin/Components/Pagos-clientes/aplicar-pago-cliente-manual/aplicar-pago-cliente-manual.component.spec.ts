import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicarPagoClienteManualComponent } from './aplicar-pago-cliente-manual.component';

describe('AplicarPagoClienteManualComponent', () => {
  let component: AplicarPagoClienteManualComponent;
  let fixture: ComponentFixture<AplicarPagoClienteManualComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AplicarPagoClienteManualComponent]
    });
    fixture = TestBed.createComponent(AplicarPagoClienteManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
