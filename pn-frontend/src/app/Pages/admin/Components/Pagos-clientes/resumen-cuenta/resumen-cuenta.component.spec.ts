import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenCuentaComponent } from './resumen-cuenta.component';

describe('ResumenCuentaComponent', () => {
  let component: ResumenCuentaComponent;
  let fixture: ComponentFixture<ResumenCuentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResumenCuentaComponent]
    });
    fixture = TestBed.createComponent(ResumenCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
