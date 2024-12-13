import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';
import { Liquidacion } from 'src/Interface/Liquidacion.interface';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService {
  constructor(private http: HttpClient) {}

  getFacturaByVendedor(id: number) {
    return this.http.get(`${baseUrl}/facturacion/?idUser=${id}`);
  }

  getLiquidacionByVendedor(id: number) {
    return this.http.get(`${baseUrl}/liquidacion/${id}`);
  }

  createLiquidacion(data: Liquidacion) {
    return this.http.post(`${baseUrl}/liquidacion/`, data);
  }
}
