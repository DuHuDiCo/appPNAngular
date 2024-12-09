import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService {
  constructor(private http: HttpClient) {}

  getInventarioByVendedor(id: number) {
    return this.http.get(`${baseUrl}/facturacion/?idUser=${id}`);
  }
}
