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

  getPagoClienteSinAplicar() {
    return this.http.get(`${baseUrl}/pagosClientes/sinAplicar`)
  }

  savePagoCliente(pagoCliente: CreatePagoCliente) {
    return this.http.post(`${baseUrl}/pagosClientes/`, pagoCliente)
  }

  savePagoClienteAutomatico(pagoCliente: CreatePagoCliente, pagoClienteId: number) {
    return this.http.post(`${baseUrl}/pagosClientes/aplicarPagoAutomatico?idPagoCliente=${pagoClienteId}`, pagoCliente)
  }

  detelePagoCliente(id: number) {
    return this.http.delete(`${baseUrl}/pagosClientes/${id}`)
  }

  obtenerPagosByCliente(id: number) {
    return this.http.get(`${baseUrl}/pagosClientes/${id}`)
  }

  obtenerFacturacionesByCliente(idClient: number) {
    return this.http.get(`${baseUrl}/facturacion/obtenerFacturacionByClient?idClient=${idClient}`)

  }
}
