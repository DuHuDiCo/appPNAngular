import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  getClientes(){
    return this.http.get(`${baseUrl}/client/`)
  }

  createCliente(cliente: any){
    return this.http.post(`${baseUrl}/client/`, cliente)  
  }

  editCliente(idCliente: number, cliente: any){
    return this.http.put(`${baseUrl}/client/${idCliente}`, cliente)
  }

  deleteCliente(idCliente: number){
    return this.http.delete(`${baseUrl}/client/${idCliente}`)
  }

  buscarCliente(dato: string){
    return this.http.get(`${baseUrl}/client/byDato?dato=${dato}`);
  }
}
