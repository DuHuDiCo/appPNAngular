import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import baseUrl from 'src/Environments/helper';
import { Usuario } from 'src/Interface/User.type';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  getUsers(){
    return this.http.get(`${baseUrl}/user/`)
  }

  saveUser(user: Usuario){
    return this.http.post(`${baseUrl}/user/`, user)
  }

}
