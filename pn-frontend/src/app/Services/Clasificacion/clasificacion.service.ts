import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionService {

  constructor(private http: HttpClient) { }

  // GET CLASIFICACION
  getClasificacion(){
    return this.http.get(`${baseUrl}/clasificacion/`)
  }

  // CREATE CLASIFICACION
  saveClasificacion(clasificacion: any){
    return this.http.post(`${baseUrl}/clasificacion/`, clasificacion)
  }

  // DELETE CLASIFICACION
  deleteClasificacion(id: number){
    return this.http.delete(`${baseUrl}/clasificacion/${id}`)
  }

}
