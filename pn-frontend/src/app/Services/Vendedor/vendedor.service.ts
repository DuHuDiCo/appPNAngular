import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  constructor(private http: HttpClient) { }

  getVendedores(){
    return this.http.get(`${baseUrl}/vendedor/`);
  }

}
