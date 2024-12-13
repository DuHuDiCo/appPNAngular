import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarLiquidacionComponent } from './buscar-liquidacion.component';

describe('BuscarLiquidacionComponent', () => {
  let component: BuscarLiquidacionComponent;
  let fixture: ComponentFixture<BuscarLiquidacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarLiquidacionComponent]
    });
    fixture = TestBed.createComponent(BuscarLiquidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
