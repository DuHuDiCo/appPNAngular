import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';
import { Login } from 'src/Interface/User.type';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  // LOGIN
  inicioSesion(credenciales: Login){
    return this.http.post(`${baseUrl}/google/`, credenciales)
  }

  // ENVIAR Y OBTENER TOKEN
  public setToken(token:string):void{
    localStorage.setItem("Token", token)
  }

  public getToken():string | null{
    var token:string| null =  localStorage.getItem("Token")
    return token;
  }

}
