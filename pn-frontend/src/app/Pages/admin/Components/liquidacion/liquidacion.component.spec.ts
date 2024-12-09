import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiquidacionComponent } from './liquidacion.component';

describe('LiquidacionComponent', () => {
  let component: LiquidacionComponent;
  let fixture: ComponentFixture<LiquidacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiquidacionComponent]
    });
    fixture = TestBed.createComponent(LiquidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
