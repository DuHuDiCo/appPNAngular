import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConectorPagosService {
  private pagosClientesSinAplicarSubject = new BehaviorSubject<any[]>([]);
  pagosClientesSinAplicar$ = this.pagosClientesSinAplicarSubject.asObservable();

  constructor() { }

  setPagosClientesSinAplicar(pagos: any[]) {
    this.pagosClientesSinAplicarSubject.next(pagos);
  }
}