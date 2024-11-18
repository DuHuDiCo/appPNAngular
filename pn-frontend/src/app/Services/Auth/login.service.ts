import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';
import { Login } from 'src/Interface/User.type';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  inicioSesion(credenciales: Login){
    return this.http.post(`${baseUrl}/google/`, credenciales)
  }

}
