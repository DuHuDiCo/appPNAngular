import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';
import { SaveProveedor } from 'src/Interface/Proveedor.interface';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(private http: HttpClient) { }

  getProveedores(){
    return this.http.get(`${baseUrl}/proveedor/`)
  }

  getProveedorByDato(dato: string){
    return this.http.get(`${baseUrl}/proveedor/byDato?dato=${dato}`);
  }

  saveProveedor(proveedor: SaveProveedor){
    return this.http.post(`${baseUrl}/proveedor/`, proveedor)  
  }

  editProveedor(idProveedor: number, proveedor: SaveProveedor){
    return this.http.put(`${baseUrl}/proveedor/${idProveedor}`, proveedor)
  }

  buscarProveedor(dato: string){
    return this.http.get(`${baseUrl}/proveedor/byDato?dato=${dato}`);
  }

  deleteProveedor(idProveedor: number){
    return this.http.delete(`${baseUrl}/proveedor/${idProveedor}`)
  }
}
