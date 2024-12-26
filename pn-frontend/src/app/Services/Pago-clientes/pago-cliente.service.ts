import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';
import { CreatePagoCliente } from 'src/Interface/PagosClientes.type';

@Injectable({
  providedIn: 'root'
})
export class PagoClienteService {

  constructor(private http: HttpClient) { }

  getPagoCliente() {
    return this.http.get(`${baseUrl}/pagosClientes/`)
  }

  savePagoCliente(pagoCliente: CreatePagoCliente) {
    return this.http.post(`${baseUrl}/pagosClientes/`, pagoCliente)
  }

  detelePagoCliente(id: number) {
    return this.http.delete(`${baseUrl}/pagosClientes/${id}`)
  }

  obtenerPagoCliente(id: number) {
    return this.http.get(`${baseUrl}/pagosClientes/${id}`)
  }
}
